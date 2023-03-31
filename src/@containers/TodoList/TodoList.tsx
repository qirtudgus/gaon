import { useState } from "react";
import { useRecoilState } from "recoil";
import { todoListState } from "../../@store/todoList";
import { TodoItem } from "./TodoItem";

const TodoList = () => {
  // const todoList = useRecoilValue(todoListState);
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
      {todoList.map((el, index) => {
        return (
          <TodoItem id={el.id} isCompleted={el.isCompleted} text={el.text} />
        );
      })}
    </div>
  );
};

export default TodoList;
