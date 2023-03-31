export interface TodoItemInterface {
  id: number;
  text: string;
  isCompleted: boolean;
}

export type TodoList = TodoItemInterface[];
