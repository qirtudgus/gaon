import { useEffect, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { fetchPosts } from "../../@store/api";

const Pagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();
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
    
      useEffect(()=>{
        
      },[])


  return <></>;
};

export { Pagination };
