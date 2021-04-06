import Agenda from "agenda";
import { MQMessage } from "../types/mqMessage.type";
import { Todo } from "../types/todo.type";

interface NotificationData {
    todo: Todo;
}

export class SchedulerService {
    private agenda: Agenda;

    constructor(mongoConnectionString: string, mongoNotificationCollectionName: string) {
        this.agenda = new Agenda({ db: { address: mongoConnectionString, collection: mongoNotificationCollectionName } });
    }

    initializeScheduler = async () => {
        return new Promise<void>((resolve, reject) => {
            this.agenda.on('ready', async () => {
                try {
                    await this.agenda.start();
                    console.log('Scheduler ready');
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
        })

    }

    scheduleNewTask = async (todo: Todo) => {
        await this.agenda.define(todo._id, (job) => {
            this.sendNotification(job.attrs.data);
        });

        this.agenda.schedule(todo.deadlineDate, todo._id, { todo: todo });
    }

    cancelTask = async (todoId: string) => {
        return this.agenda.cancel({ name: todoId });
    }

    editExistingTask = async (todo: Todo) => {
        await this.cancelTask(todo._id);
        this.scheduleNewTask(todo);
    }

    sendNotification = async (data: NotificationData) => {
        console.log(`Task: ${data.todo.description} reached deadline`);
    }

    consumeNewTask = (msg) => {
        const mqMessage: MQMessage = JSON.parse(msg.content.toString());

        switch (mqMessage.action) {
            case "cancel":
                this.cancelTask(mqMessage.todo._id);
                break;
            case "edit":
                this.editExistingTask(mqMessage.todo);
                break;
            case "new":
                this.scheduleNewTask(mqMessage.todo);
                break;

            default:
                break;
        }
    }
}