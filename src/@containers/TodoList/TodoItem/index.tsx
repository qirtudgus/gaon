import { useRecoilState } from "recoil";
import { TodoItemInterface, TodoList } from "../../../@interface/TodoList";
import { todoListState } from "../../../@store/todoList";

export const TodoItem = ({ id, text, isCompleted }: TodoItemInterface) => {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem.id === id);

  const editItemText = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const newList = replaceItemAtIndex(todoList, index, {
      id,
      isCompleted,
      text: value,
    });
    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      id,
      text,
      isCompleted: !isCompleted,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <div>
      <input type="text" value={text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
};

function replaceItemAtIndex(
  arr: TodoList,
  index: number,
  newValue: TodoItemInterface,
) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr: TodoList, index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
