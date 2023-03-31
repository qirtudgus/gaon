import { atom } from "recoil";

interface TodoList {
  id: number;
  text: string;
  isCompleted: boolean;
}

export const todoListState = atom<TodoList[]>({
  key: "todoListState",
  default: [{ id: 1, text: "리코일 써보기", isCompleted: false }],
});
