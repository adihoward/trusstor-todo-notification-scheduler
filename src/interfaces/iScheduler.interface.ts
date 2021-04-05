import { Todo } from "../types/todo.type";

export interface IScheduler {
    scheduleNewTask: (todo: Todo) => void;
    editExistingTask: (todo: Todo) => void;
    cancelTask: (todoId: string) => void
}