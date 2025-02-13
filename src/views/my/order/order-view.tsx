import FilterOrder from "@/components/filter/filter-order";
import CardOrder from "@/components/card/card-order";
import { useInfiniteQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { TOrder } from "@/lib/db/schema";
import { useRouter } from "next/router";
import InfiniteScrollLayout from "@/layouts/infinite-scroll-layout";
import { pageSizeOrders } from "@/utils/constant";
import { DatePickerRange } from "@/components/date-range-picker-order";

const OrderView = () => {
  const { query } = useRouter();
  const {
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isLoading,
    data,
  } = useInfiniteQuery({
    queryKey: [
      "orders",
      query.status ? query.status : "without status",
      query.from ? query.from : "without from",
      query.to ? query.to : "without to",
    ],
    queryFn: async ({ pageParam }) => {
      const from = query.from ? `&from=${query.from}` : "";
      const to = query.to ? `&to=${query.to}` : "";
      const status = query.status ? `&status=${query.status}` : "";
      return (
        await instance.get(
          `/orders?page=${pageParam}&limit=${pageSizeOrders}${from}${to}${status}`
        )
      ).data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, nextPage) => {
      return nextPage.length >= lastPage.totalPage
        ? undefined
        : nextPage.length + 1;
    },
    enabled: !!query,
  });

  return (
    <InfiniteScrollLayout
      className="lg:col-span-2 pb-8"
      callback={() => hasNextPage && !isFetching && fetchNextPage()}
      isFetching={isFetchingNextPage}
    >
      <section className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <FilterOrder lists={["Pending", "Success", "Canceled"]} />
          <DatePickerRange align="end" />
        </div>
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
                ) => <CardOrder key={order.id} {...order} isOwner={false} />
              )}
      </section>
    </InfiniteScrollLayout>
  );
};

export default OrderView;
