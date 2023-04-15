import { FC } from 'react';

import { Routes, Route } from 'react-router-dom';
import App from '../App';
import { InfinityScroll } from '../@containers/InfinityScroll';

const RootRouter: FC = () => {
  return (
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/infinityscroll' element={<InfinityScroll />} />
    </Routes>
  );
};

export { RootRouter };
