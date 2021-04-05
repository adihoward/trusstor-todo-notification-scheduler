import { config } from 'dotenv';
config();

import { SchedulerService } from './services/scheduler.service';
import { TaskConsumerService } from './services/taskConsumer.service';

(async () => {
    const schedulerService = new SchedulerService(process.env.MONGO_CONNECTION_URL, process.env.MONGO_NOTIFICATION_TASKS_COLLECTION_NAME);
    await schedulerService.initializeScheduler();

    const taskConsumerService = new TaskConsumerService(process.env.MQ_URL, process.env.MQ_QUEUE_NAME, schedulerService);
    taskConsumerService.initializeConsumer();
})()



try {
} catch (err) {
    console.error(err);
}
