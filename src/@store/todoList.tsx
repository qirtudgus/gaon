import { atom } from "recoil";

interface TodoList {
  text?: string;
}

export const todoListState = atom<TodoList[]>({
  key: "todoListState",
  default: [{ text: "zzzz" }],
});
