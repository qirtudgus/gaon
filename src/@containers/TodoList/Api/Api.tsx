import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { ApiState } from '../../../@store/api';

const Api = () => {
  const postList = useRecoilValue(ApiState);

  if (!postList || !postList.data) {
    // postList가 undefined이거나 data 속성이 없는 경우
    return null;
  }

  return (
    <div>
      {postList.data.map((el: any, idx: number) => (
        <p key={idx}>{el.id}</p>
      ))}
    </div>
  );
};

export default Api;
