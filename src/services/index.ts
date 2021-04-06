import { SchedulerService } from "./scheduler.service";
import { TaskConsumerService } from "./mqConsumer.service";

let schedulerService: SchedulerService;
let taskConsumerService: TaskConsumerService;

export const initializeServices = async () => {
    schedulerService = new SchedulerService(process.env.MONGO_CONNECTION_URL, process.env.MONGO_NOTIFICATION_TASKS_COLLECTION_NAME);
    await schedulerService.initializeScheduler();

    taskConsumerService = new TaskConsumerService(process.env.MQ_URL, process.env.MQ_QUEUE_NAME, schedulerService.consumeNewTask);
    await taskConsumerService.initializeConsumer();
}
