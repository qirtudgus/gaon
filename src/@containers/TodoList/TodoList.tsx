import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  filteredTodoListState,
  todoListFilterState,
  todoListState,
} from "../../@store/todoList";
import { TodoItem } from "./TodoItem";

const TodoList = () => {
  const filteredTodoList = useRecoilValue(filteredTodoListState);
  // const setTodoList = useSetRecoilState(todoListState);

  const [todoList, setTodoList] = useRecoilState(todoListState);

  const [value, setValue] = useState("");

  const addItem = () => {
    setTodoList((prev) => [
      ...prev,
      {
        id: prev[prev.length - 1].id + 1,
        text: value,
        isCompleted: false,
      },
    ]);
    setValue("");
  };
  const onChange = (target: React.ChangeEvent<HTMLInputElement>) => {
    console.log(target.currentTarget.value);
    setValue(target.currentTarget.value);
  };

  return (
    <div>
      <input onChange={onChange} value={value}></input>
      <button onClick={addItem}>더하기</button>
      {filteredTodoList.map((el, index) => {
        return (
          <TodoItem
            key={el.id}
            id={el.id}
            isCompleted={el.isCompleted}
            text={el.text}
          />
        );
      })}
    </div>
  );
};

export default TodoList;

const TodoListFilters = () => {
  const [filter, setFilter] = useRecoilState(todoListFilterState);

  const updateFilter = ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(value);
  };

  return <></>;
};
