import Agenda from "agenda";
import { IScheduler } from "../interfaces/iScheduler.interface";
import { Todo } from "../types/todo.type";

interface NotificationData {
    todo: Todo;
}

export class SchedulerService implements IScheduler {
    private agenda: Agenda;

    constructor(mongoConnectionString: string, mongoNotificationCollectionName: string) {
        this.agenda = new Agenda({ db: { address: mongoConnectionString, collection: mongoNotificationCollectionName } });
    }

    initializeScheduler = async () => {
        return new Promise<void>((resolve, reject) => {
            this.agenda.on('ready', async () => {
                try {
                    await this.agenda.define("Notify user", (job) => {
                        this.sendNotification(job.attrs.data);
                    });

                    await this.agenda.start();

                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
        })

    }

    scheduleNewTask = (todo: Todo) => {
        this.agenda.schedule(todo.deadlineDate, "Notify user", { todo: todo });
    }

    editExistingTask = () => {

    }

    sendNotification = async (data: NotificationData) => {
        console.log(`Task: ${data.todo.description} reached deadline`);
    }
}