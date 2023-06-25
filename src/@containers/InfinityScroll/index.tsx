import React, { useEffect, useLayoutEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { fetchPosts } from "../../@store/api";
function InfinityScroll() {
  const [currentPage, setCurrentPage] = useState(1);
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    // console.log(ref);
    console.log(inView);
    // console.log(entry);
    if (inView) {
      fetchNextPage();
      // setCurrentPage((prev) => prev + 1);
    }
  }, [inView]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(["posts", currentPage], fetchPosts, {
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

  useEffect(() => {
    const nextPage = currentPage + 1;
    queryClient.prefetchQuery(["posts", nextPage], () =>
      fetchPosts({ pageParam: nextPage }),
    );
  }, [currentPage]);



  if (isLoading)
    return (
      <div className="flex justify-center items-center flex-col ">
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  if (isError) return <p>Error :(</p>;

  return (
    <div className="flex justify-center items-center  flex-col">
      {data &&
        data.pages.map((page: any, i: number) =>
          page.data.map((item: any, i: number) => {
            return (
              <React.Fragment key={i}>
                <div
                  className=" w-[200px] h-[50px] bg-slate-300 m-3 shadow-md rounded-md"
                  key={item.id}
                  ref={ref}
                >
                  <h2 className="truncate">{item.title}</h2>
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
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </>
          ) : (
            "Load More"
          )}
        </button>
      )}
    </div>
  );
}

export { InfinityScroll };
