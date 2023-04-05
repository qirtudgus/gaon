import axios from 'axios';
import { useQuery } from 'react-query';
import { PostListInterface } from '../../../@interface/TodoList';

const Query = () => {
  // useQuery 훅을 사용하여 데이터를 요청
  const { isLoading, isError, data } = useQuery('myData', async () => {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/posts',
    );
    const data: PostListInterface[] = await response.data;
    console.log(data);
    return data;
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error occurred</p>
      ) : (
        data?.map((el: PostListInterface, idx: number) => (
          <p key={idx}>{el.title}</p>
        ))
      )}
    </div>
  );
};

export default Query;
