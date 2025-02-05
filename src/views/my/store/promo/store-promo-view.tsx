import CardPromo from "@/components/card/card-promo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import InfiniteScrollLayout from "@/layouts/infinite-scroll-layout";
import { TPromo } from "@/lib/db/schema";

const StorePromoView = () => {

  const {
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isFetching,
    data,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["store-promo-owner"],
    queryFn: async ({ pageParam }) =>
      (await instance.get(`/users/login/store/promo?page=${pageParam}&limit=9`))
        .data,
    getNextPageParam: (lastPage, nextPage) => {
      return nextPage.length >= lastPage.totalPage
        ? undefined
        : nextPage.length + 1;
    },
  });

  return (
    <InfiniteScrollLayout
      className="col-span-2"
      callback={() => hasNextPage && !isFetching && fetchNextPage()}
      isFetching={isFetchingNextPage}
    >
      <section className="flex flex-col gap-4 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">Promo</h1>
          <Button asChild variant="primary">
            <Link href={"/my/store/promo/new"}>Create new promo</Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <CardPromo.Skeleton key={i} />
              ))
            : data?.pages
                .flatMap((order) => order.data)
                .map(
                  (
                    promo: Pick<
                      TPromo,
                      | "amount"
                      | "code"
                      | "id"
                      | "uses"
                      | "productsAllowed"
                      | "expiredAt"
                    >
                  ) => <CardPromo key={promo.id} {...promo} />
                )}
        </div>
      </section>
    </InfiniteScrollLayout>
  );
};

export default StorePromoView;
