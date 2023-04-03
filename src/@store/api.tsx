import axios from 'axios';
import { atom, selector } from 'recoil';

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
export const ChangePossibleApiState = atom({
  key: 'ChangePossibleApiState',
  default: selector({
    key: 'ChangeApiState',
    get: async ({ get }) => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
      return res.data;
    },
  }),
});

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
