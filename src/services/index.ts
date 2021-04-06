import { SchedulerService } from "./scheduler.service";
import { TaskConsumerService } from "./mqConsumer.service";

export const initializeServices = async () => {
    const schedulerService = new SchedulerService(process.env.MONGO_CONNECTION_URL, process.env.MONGO_NOTIFICATION_TASKS_COLLECTION_NAME);
    await schedulerService.initializeScheduler();

    const taskConsumerService = new TaskConsumerService(process.env.MQ_URL, process.env.MQ_QUEUE_NAME, schedulerService.consumeNewTask);
    await taskConsumerService.initializeConsumer();
}
