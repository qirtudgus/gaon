export interface TodoItemInterface {
  id: number;
  text: string;
  isCompleted: boolean;
}

export type TodoList = TodoItemInterface[];

export interface PostListInterface {
  body: string;
  id: number;
  userId: number;
  title: string;
}
