import { atom } from "recoil";
import { TodoList } from "../@interface/TodoList";

export const todoListState = atom<TodoList>({
  key: "todoListState",
  default: [{ id: 1, text: "리코일 써보기", isCompleted: false }],
});
