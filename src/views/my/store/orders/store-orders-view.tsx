import CardOrder from "@/components/card/card-order";
import { DatePickerRange } from "@/components/date-range-picker-order";
import FilterOrder from "@/components/filter/filter-order";
import InfiniteScrollLayout from "@/layouts/infinite-scroll-layout";
import instance from "@/lib/axios/instance";
import { TOrder } from "@/lib/db/schema";
import { pageSizeOrders } from "@/utils/constant";
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
    queryKey: [
      "orders-store",
      query.status ? query.status : "without-status",
      query.from ? query.from : "without-from-date",
      query.to ? query.to : "without-to-date",
    ],
    queryFn: async ({ pageParam }) => {
      const from = query.from ? `&from=${query.from}` : "";
      const to = query.to ? `&to=${query.to}` : "";
      const status = query.status ? `&status=${query.status}` : "";
      return (
        await instance.get(
          `/users/login/store/orders?page=${pageParam}&limit=${pageSizeOrders}${status}${from}${to}`
        )
      ).data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, nextPage) => {
      return nextPage.length >= lastPage.totalPage
        ? undefined
        : nextPage.length + 1;
    },
  });

  return (
    <InfiniteScrollLayout
      className="lg:col-span-2 pb-8"
      callback={() => hasNextPage && !isFetching && fetchNextPage()}
      isFetching={isFetchingNextPage}
    >
      <section className="flex flex-col gap-4">
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
                ) => <CardOrder key={order.id} {...order} isOwner />
              )}
      </section>
    </InfiniteScrollLayout>
  );
};

export default StoreOrdersView;
