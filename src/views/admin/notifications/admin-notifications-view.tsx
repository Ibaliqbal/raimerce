import ButtonDeleteAllNotif from "@/components/button/button-delete-all-notif";
import ButtonMarkAllNotif from "@/components/button/button-mark-all-notif";
import CardNotification from "@/components/card/card-notification";
import InfiniteScrollLayout from "@/layouts/infinite-scroll-layout";
import instance from "@/lib/axios/instance";
import { TNotification } from "@/lib/db/schema";
import { pageSizeNotifications } from "@/utils/constant";
import { useInfiniteQuery } from "@tanstack/react-query";

const AdminNotificationsView = () => {
  const {
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isLoading,
    data,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam }) =>
      (
        await instance.get(
          `/admin/notifications?page=${pageParam}&limit=${pageSizeNotifications}`
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
    <section className="flex flex-col gap-4 lg:col-span-2">
      <div className="flex gap-3 self-end">
        <ButtonDeleteAllNotif user="admin" />
        <ButtonMarkAllNotif user="admin" />
      </div>
      <InfiniteScrollLayout
        callback={() => hasNextPage && !isFetching && fetchNextPage()}
        isFetching={isFetchingNextPage}
        className="pb-8"
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
    </section>
  );
};

export default AdminNotificationsView;
