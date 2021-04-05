import { Todo } from "./todo.type";

export interface MQMessage {
    action: "cancel" | "new" | "edit";
    todo: Todo;
}