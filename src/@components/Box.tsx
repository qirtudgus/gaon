import React, { FC } from 'react';
import { PostListInterface } from '../@interface/TodoList';

const Box = ({ id, userId, title, body }: PostListInterface) => {
  return (
    <div className=' box'>
      <div className='text-2xl'>{id}</div>
      <div className=' text-left'>{title}</div>
    </div>
  );
};

export default React.memo(Box);
