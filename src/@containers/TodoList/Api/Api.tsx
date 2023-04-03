import { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '../../../@components/Box';
import { ApiState, ChangePossibleApiState } from '../../../@store/api';

const Api = () => {
  const [postList, setPostList] = useRecoilState(ChangePossibleApiState);

  useEffect(() => {
    // 오류없이 아톰의 초기값을 핸들링할 수 있다.
    // setPostList((prev: any) => prev.concat({ id: '1' }));
  }, []);

  //   if (!postList || !postList) {
  //     // postList가 undefined이거나 data 속성이 없는 경우
  //     return null;
  //   }

  return (
    <div>
      <button
        onClick={() => {
          console.log(postList);
          setPostList((prev: any) => prev.concat({ id: '1' }));
        }}
      >
        포스트확인
      </button>
      {postList.map((el, idx: number) => (
        <Box
          key={el.id}
          userId={el.userId}
          id={el.id}
          title={el.title}
          body={el.body}
        ></Box>
      ))}
    </div>
  );
};

export default Api;
