import { useRecoilState } from "recoil";
import { TodoItemInterface, TodoList } from "../../../@interface/TodoList";
import { todoListState } from "../../../@store/todoList";

export const TodoItem = ({ id, text, isCompleted }: TodoItemInterface) => {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  //각 아이템의 index를 획득하는 변수다.
  //todoList에서 props로 받아온 id와 같은 요소인 인덱스를 반환한다.
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
//투두리스트중 선택한 요소의 value가 수정된 배열을 반환해주는 함수
function replaceItemAtIndex(
  arr: TodoList,
  index: number,
  newValue: TodoItemInterface,
) {
  console.log(...arr.slice(0, index));
  console.log(...arr.slice(index + 1));
  //현재 아이템 이전까지의 요소를 복사, 새로운 요소넣고, 현재 아이템 이후의 모든 요소 복사
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}
//선택된 인덱스를 제외한 요소들을 복사하여 삭제 구현
function removeItemAtIndex(arr: TodoList, index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
