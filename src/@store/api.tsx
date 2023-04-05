import axios from 'axios';
import { atom, selector } from 'recoil';
import { PostListInterface } from '../@interface/TodoList';

export const ApiState = selector({
  key: 'ApiState',
  get: async ({ get }) => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return res;
  },
});

/*
아톰의 기본값을 비동기쿼리 값으로 설정하여
해당값을 클라이언트에서 핸들링할 수 있게된다.
*/
export const ChangePossibleApiState = atom<PostListInterface[]>({
  key: 'ChangePossibleApiState',
  default: selector({
    key: 'ChangeApiState',
    get: async ({ get }) => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
      return res.data.slice(0, 10);
    },
  }),
});

/*
React.suspense와 ErrorBoundary로 진행상태를 핸들링해줄 수 있다.
*/
export const ErrorApiState = selector<any | unknown>({
  key: 'ErrorApiState',
  get: async ({ get }) => {
    try {
      const res = await axios.get(
        'https://jsonplaceholder.typicode.com/posts/101',
      );
      return res;
    } catch (error) {
      return error;
    }
  },
});
