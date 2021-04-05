import { SchedulerService } from "./scheduler.service";
import { TaskConsumerService } from "./taskConsumer.service";

let schedulerService: SchedulerService;
let taskConsumerService: TaskConsumerService;

export async function initializeServices() {
    schedulerService = new SchedulerService(process.env.MONGO_CONNECTION_URL, process.env.MONGO_NOTIFICATION_TASKS_COLLECTION_NAME);
    await schedulerService.initializeScheduler();

    taskConsumerService = new TaskConsumerService(process.env.MQ_URL, process.env.MQ_QUEUE_NAME, schedulerService);
    taskConsumerService.initializeConsumer();
}

export { schedulerService, taskConsumerService };