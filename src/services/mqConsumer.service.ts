import amqp from 'amqplib/callback_api';

export class TaskConsumerService {
    private mqUrl: string;
    private mqQueueName: string;
    private consumeCallback: () => void;

    constructor(mqUrl, mqQueueName, consumeCallback) {
        this.mqUrl = mqUrl;
        this.mqQueueName = mqQueueName;
        this.consumeCallback = consumeCallback;
    }

    initializeConsumer = async () => {
        return new Promise<void>((resolve, reject) => {
            amqp.connect(this.mqUrl, (err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }

                connection.createChannel((err, channel) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    channel.assertQueue(this.mqQueueName, {
                        durable: true
                    });

                    channel.consume(this.mqQueueName, this.consumeCallback, {
                        noAck: true
                    });

                    console.log('Connected to mq');
                    resolve();
                });
            });
        });
    }
}