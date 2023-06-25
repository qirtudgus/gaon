import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  filteredTodoListState,
  todoListFilterState,
  todoListState,
  todoListStatsState,
} from "../../@store/todoList";
import { TodoItem } from "./TodoItem";

const TodoList = () => {
  const filteredTodoList = useRecoilValue(filteredTodoListState);
  // const setTodoList = useSetRecoilState(todoListState);

  const [todoList, setTodoList] = useRecoilState(todoListState);

  const [value, setValue] = useState("");

  // const addItem = () => {
  //   setTodoList((prev) => [
  //     ...prev,
  //     {
  //       id: prev[prev.length - 1].id + 1,
  //       text: value,
  //       isCompleted: false,
  //     },
  //   ]);
  //   setValue('');
  // };
  const onChange = (target: React.ChangeEvent<HTMLInputElement>) => {
    console.log(target.currentTarget.value);
    setValue(target.currentTarget.value);
  };

  return (
    <div>
      <TodoListStats />
      <TodoListFilters />
      <input onChange={onChange} value={value}></input>
      {/* <button onClick={addItem}>더하기</button> */}
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

  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show Uncompleted">Uncompleted</option>
      </select>
    </>
  );
};

function TodoListStats() {
  const { totalNum, totalCompletedNum, totalUncompletedNum, percentCompleted } =
    useRecoilValue(todoListStatsState);

  const formattedPercentCompleted = Math.round(percentCompleted * 100);

  return (
    <ul>
      <li>Total items: {totalNum}</li>
      <li>Items completed: {totalCompletedNum}</li>
      <li>Items not completed: {totalUncompletedNum}</li>
      <li>Percent completed: {formattedPercentCompleted}</li>
    </ul>
  );
}
