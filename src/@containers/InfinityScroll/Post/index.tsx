import { FC } from 'react';
import { Post as PostType } from './state';

const PostComponent = ({ data }: { data: PostType }) => {
  return (
    <>
      <div>
        <div className=' w-[200px] h-[300px] bg-slate-400 m-3'>
          {data.title}
        </div>
        );
      </div>
    </>
  );
};

export { PostComponent };
