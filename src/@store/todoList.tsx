import { atom, selector } from "recoil";
import { TodoList } from "../@interface/TodoList";

export const todoListState = atom<TodoList>({
  key: "todoListState",
  default: [{ id: 1, text: "리코일 써보기", isCompleted: false }],
});

export const todoListFilterState = atom({
  key: "todoListFilterState",
  default: "Show All",
});

export const filteredTodoListState = selector({
  key: "filteredTodoListState",
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case "Show Completed":
        return list.filter((item) => item.isCompleted);
      case "Show Uncompleted":
        return list.filter((item) => !item.isCompleted);
      default:
        return list;
    }
  },
});
