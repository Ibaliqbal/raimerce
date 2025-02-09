import CardProduct from "@/components/card/card-product";
import FilterBySelect from "@/components/filter/filter-by-select";
import { Button } from "@/components/ui/button";
import InfiniteScrollLayout from "@/layouts/infinite-scroll-layout";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { categories } from "@/utils/constant";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";

const StoreProductsView = () => {
  const { query } = useRouter();
  const {
    hasNextPage,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    data,
  } = useInfiniteQuery({
    queryKey: [
      "store-products-owner",
      query.c ? query.c : "without-filtering-category",
    ],
    queryFn: async ({ pageParam }) =>
      (
        await instance.get(
          query.c
            ? `/users/login/store/products?page=${pageParam}&limit=9&c=${query.c}`
            : `/users/login/store/products?page=${pageParam}&limit=9`
        )
      ).data,
    retry: false,
    staleTime: 60000, // 1 minute
    enabled: !!query,
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
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <FilterBySelect
            filterBy="category"
            lists={categories.map((category) => category.name)}
          />
          <Button variant="primary" asChild>
            <Link
              className="flex items-center gap-3"
              href={"/my/store/products/create"}
            >
              <FaPlus />
              Create product
            </Link>
          </Button>
        </div>
        <div className="w-full grid lg:grid-cols-3 grid-cols-2 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <CardProduct.Skeleton key={i} />
              ))
            : data?.pages
                .flatMap((order) => order.data)
                .map(
                  (
                    product: Pick<
                      TProducts,
                      "id" | "name" | "description" | "rating" | "variant"
                    >
                  ) => <CardProduct key={product.id} hisMine {...product} />
                )}
        </div>
      </section>
    </InfiniteScrollLayout>
  );
};

export default StoreProductsView;
