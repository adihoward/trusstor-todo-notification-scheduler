import amqp from 'amqplib/callback_api';
import { IScheduler } from '../interfaces/iScheduler.interface';
import { MQMessage } from '../types/mqMessage.type';
import { Todo } from '../types/todo.type';

export class TaskConsumerService {
    private mqUrl: string;
    private mqQueueName: string;
    private schedulerService: IScheduler;

    constructor(mqUrl, mqQueueName, schedulerService: IScheduler) {
        this.mqUrl = mqUrl;
        this.schedulerService = schedulerService;
        this.mqQueueName = mqQueueName;
    }

    initializeConsumer = async () => {
        amqp.connect(this.mqUrl, (err, connection) => {
            if (err) {
                throw err;
            }

            connection.createChannel((err, channel) => {
                if (err) {
                    throw err;
                }

                channel.assertQueue(this.mqQueueName, {
                    durable: true
                });

                channel.consume(this.mqQueueName, (msg) => {
                    const mqMessage: MQMessage = JSON.parse(msg.content.toString());

                    switch (mqMessage.action) {
                        case "cancel":
                            this.schedulerService.cancelTask(mqMessage.todo._id);
                            break;
                        case "edit":
                            this.schedulerService.editExistingTask(mqMessage.todo);
                            break;
                        case "new":
                            this.schedulerService.scheduleNewTask(mqMessage.todo);
                            break;

                        default:
                            break;
                    }
                }, {
                    noAck: true
                });
            });
        });
    }
}