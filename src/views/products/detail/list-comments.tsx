import CardComment from "@/components/card/card-comment";
import { Skeleton } from "@/components/ui/skeleton";
import InfiniteScrollLayout from "@/layouts/infinite-scroll-layout";
import instance from "@/lib/axios/instance";
import { TComment, TUser } from "@/lib/db/schema";
import { ApiResponse } from "@/utils/api";
import { pageSizeComments } from "@/utils/constant";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  id: string;
};

const ListComments = ({ id }: Props) => {
  const {
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isLoading,
    data,
  } = useInfiniteQuery<
    ApiResponse & {
      data: Array<
        Pick<
          TComment,
          "id" | "content" | "rating" | "createdAt" | "medias" | "variant"
        > & {
          user: Pick<TUser, "name" | "avatar">;
        }
      >;
      totalPage: number;
    }
  >({
    queryKey: ["comment", "product", id],
    queryFn: async ({ pageParam }) =>
      (
        await instance.get(
          `/products/${id}/comments?page=${pageParam}&limit=${pageSizeComments}`
        )
      ).data,
    initialPageParam: 1,
    getNextPageParam: (lastPage, nextPage) => {
      return nextPage?.length >= lastPage?.totalPage
        ? undefined
        : nextPage?.length + 1;
    },
  });

  return (
    <InfiniteScrollLayout
      callback={() => hasNextPage && !isFetching && fetchNextPage()}
      isFetching={isFetchingNextPage}
    >
      <section className="flex flex-col gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton className="w-full md:h-[150px] h-[100px]" key={i} />
            ))
          : data?.pages
              .flatMap((res) => res?.data)
              .map((comment) => <CardComment key={comment?.id} {...comment} />)}
      </section>
    </InfiniteScrollLayout>
  );
};

export default ListComments;
