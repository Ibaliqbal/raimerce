import CardOrder from "@/components/card/card-order";
import FilterOrder from "@/components/filter/filter-order";
import InfiniteScrollLayout from "@/layouts/infinite-scroll-layout";
import instance from "@/lib/axios/instance";
import { TOrder } from "@/lib/db/schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const StoreOrdersView = () => {
  const { query } = useRouter();
  const {
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isLoading,
    data,
  } = useInfiniteQuery({
    queryKey: ["orders-store", query.status ? query.status : "without-status"],
    queryFn: async ({ pageParam }) =>
      (
        await instance.get(
          query.status
            ? `/users/login/store/orders?status=${query.status}&page=${pageParam}&limit=2`
            : `/users/login/store/orders?page=${pageParam}&limit=2`
        )
      ).data,
    initialPageParam: 1,
    getNextPageParam: (lastPage, nextPage) => {
      return nextPage.length >= lastPage.totalPage
        ? undefined
        : nextPage.length + 1;
    },
  });

  return (
    <InfiniteScrollLayout
      className="col-span-2 pb-8"
      callback={() => hasNextPage && !isFetching && fetchNextPage()}
      isFetching={isFetchingNextPage}
    >
      <section className="flex flex-col gap-4">
        <FilterOrder
          lists={["Pending", "Success", "Canceled"]}
          baseRoute="/my/store/orders"
        />
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <CardOrder.Skeleton key={i} />
            ))
          : data?.pages
              .flatMap((order) => order.data)
              .map(
                (
                  order: Pick<
                    TOrder,
                    | "id"
                    | "products"
                    | "transactionCode"
                    | "status"
                    | "promoCodes"
                  >
                ) => <CardOrder key={order.id} {...order} isOwner />
              )}
      </section>
    </InfiniteScrollLayout>
  );
};

export default StoreOrdersView;
