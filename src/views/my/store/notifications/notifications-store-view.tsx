import CardNotification from "@/components/card/card-notification";
import InfiniteScrollLayout from "@/layouts/infinite-scroll-layout";
import instance from "@/lib/axios/instance";
import { TNotification } from "@/lib/db/schema";
import { pageSizeNotifications } from "@/utils/constant";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

const NotificationsStoreView = () => {
  const {
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isLoading,
    data,
  } = useInfiniteQuery({
    queryKey: ["notifications", "store"],
    queryFn: async ({ pageParam }) =>
      (
        await instance.get(
          `/users/login/store/notifications?page=${pageParam}&limit=${pageSizeNotifications}`
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
      callback={() => hasNextPage && !isFetching && fetchNextPage()}
      isFetching={isFetchingNextPage}
      className="lg:col-span-2 pb-8"
    >
      <section className="flex flex-col gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <CardNotification.Skeleton key={i} />
            ))
          : data?.pages
              .flatMap((order) => order.data)
              .map(
                (
                  notif: Pick<
                    TNotification,
                    "id" | "content" | "createdAt" | "isRead"
                  >
                ) => <CardNotification key={notif.id} {...notif} />
              )}
      </section>
    </InfiniteScrollLayout>
  );
};

export default NotificationsStoreView;
