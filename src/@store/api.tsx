import axios from 'axios';
import { atom, selector } from 'recoil';

export const ApiState = selector({
  key: 'ApiState',
  get: async ({ get }) => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return res;
  },
});
