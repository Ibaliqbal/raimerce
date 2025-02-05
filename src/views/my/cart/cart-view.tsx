import CardCart from "@/components/card/card-cart";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import instance from "@/lib/axios/instance";
import ButtonGoToCheckout from "@/components/button/button-go-to-checkout";
import InfiniteScrollLayout from "@/layouts/infinite-scroll-layout";
import { VariantSchemaT } from "@/types/product";
import { pageSizeCarts } from "@/utils/constant";

const CartView = () => {
  const {
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isLoading,
    data,
  } = useInfiniteQuery({
    queryKey: ["cart"],
    queryFn: async ({ pageParam }) =>
      (await instance.get(`/carts?page=${pageParam}&limit=${pageSizeCarts}`))
        .data,
    initialPageParam: 1,
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
      <section className="flex flex-col gap-4">
        <ButtonGoToCheckout />
        {isLoading ? (
          <section className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <CardCart.Skeleton key={i} />
            ))}
          </section>
        ) : (
          <section className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {data?.pages
                .flatMap((order) => order.data)
                .map((cart) => (
                  <motion.div
                    key={cart.id}
                    layout
                    className="flex flex-col gap-4"
                  >
                    <CardCart
                      id={cart.id}
                      withAction
                      quantity={cart.quantity}
                      isCheckout={cart.isCheckout}
                      selectedVariant={cart.product?.variant.find(
                        (va: VariantSchemaT) => va.name_variant === cart.variant
                      )}
                      name={cart.product?.name as string}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </section>
        )}
      </section>
    </InfiniteScrollLayout>
  );
};

export default CartView;
