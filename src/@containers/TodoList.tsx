import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { todoListState } from "../@store/todoList";

const TodoList = () => {
  const todoList = useRecoilValue(todoListState);
  const setTodoList = useSetRecoilState(todoListState);
  const [value, setValue] = useState("");

  const addItem = () => {
    setTodoList((prev) => [
      ...prev,
      {
        text: value,
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
      {todoList.map((el, index) => (
        <p key={index}>{el?.text}</p>
      ))}
    </div>
  );
};

export default TodoList;
