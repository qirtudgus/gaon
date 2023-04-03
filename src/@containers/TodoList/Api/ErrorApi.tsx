import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { ErrorApiState } from '../../../@store/api';

const ErrorApi = () => {
  const errorApi = useRecoilValue(ErrorApiState);

  return <>{errorApi?.data.userId}</>;
};
export default ErrorApi;
