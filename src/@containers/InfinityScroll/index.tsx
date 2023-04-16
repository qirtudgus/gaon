import axios, { AxiosError } from 'axios';
import { useInfiniteQuery, useQuery } from 'react-query';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchPosts } from '../../@store/api';
function InfinityScroll() {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  useEffect(() => {
    // console.log(ref);
    console.log(inView);
    // console.log(entry);
    if (inView) fetchNextPage();
  }, [inView]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery('posts', fetchPosts, {
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPageNumber : undefined,
    onSuccess: (data) => {
      console.log(data);
    },
    staleTime: 2000,
    cacheTime: 2000,
  });

  useEffect(() => {
    console.log(isFetchingNextPage);
  }, [isFetchingNextPage]);

  if (isLoading)
    return (
      <div className='flex justify-center items-center flex-col '>
        <div className='lds-ellipsis'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  if (isError) return <p>Error :(</p>;

  return (
    <div className='flex justify-center items-center  flex-col'>
      {data &&
        data.pages.map((page: any, i: number) =>
          page.data.map((item: any, i: number) => {
            return (
              <React.Fragment key={i}>
                <div
                  className=' w-[200px] h-[50px] bg-slate-300 m-3 shadow-md rounded-md'
                  key={item.id}
                  ref={ref}
                >
                  <h2 className='truncate'>{item.title}</h2>
                  <p>{item.userId}</p>
                </div>
              </React.Fragment>
            );
          }),
        )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {/* {isLoading ? 'Loading more...' : 'Load More'} */}
          {isFetchingNextPage ? (
            <>
              <div className='lds-ellipsis'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </>
          ) : (
            'Load More'
          )}
        </button>
      )}
    </div>
  );
}

export { InfinityScroll };
