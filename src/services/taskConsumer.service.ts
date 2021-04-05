import amqp from 'amqplib/callback_api';
import { IScheduler } from '../interfaces/iScheduler.interface';
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
                    durable: false
                });

                channel.consume(this.mqQueueName, (msg) => {
                    //need to validate data
                    const todo: Todo = JSON.parse(msg.content.toString());

                    this.schedulerService.scheduleNewTask(todo);
                }, {
                    noAck: true
                });
            });
        });
    }
}