import CardCart from "@/components/card/card-cart";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import instance from "@/lib/axios/instance";
import { TCart, TProducts } from "@/lib/db/schema";
import ButtonGoToCheckout from "@/components/button/button-go-to-checkout";
import Link from "next/link";

const CartView = () => {
  const { isLoading, data } = useQuery<
    Array<{
      storeName: string | undefined;
      storeId: string | undefined;
      carts: Array<
        Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
          product: Pick<TProducts, "name" | "variant"> | null;
        }
      >;
    }>
  >({
    queryKey: ["cart"],
    queryFn: async () => (await instance.get("/carts")).data.data,
    staleTime: 60000, // Cache the data for 1 minute before refetching it
  });

  return (
    <section className="col-span-2 flex flex-col gap-4">
      <ButtonGoToCheckout />
      {isLoading ? (
        <section className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <CardCart.Skeleton key={i} />
          ))}
        </section>
      ) : (
        <section className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {data?.map((cart) => (
              <motion.div
                key={cart.storeId}
                layout
                className="flex flex-col gap-3 relative border-b-2 border-gray-300 pb-6"
              >
                <Link
                  href={`/store/${encodeURIComponent(
                    cart.storeName as string
                  )}/products`}
                  className="text-xl w-fit font-semibold"
                >
                  {cart.storeName}
                </Link>
                <div className="grid grid-cols-2 gap-4">
                  {cart.carts.map((product) => (
                    <CardCart
                      id={product.id}
                      withAction
                      quantity={product.quantity}
                      isCheckout={product.isCheckout}
                      selectedVariant={product.product?.variant.find(
                        (va) => va.name_variant === product.variant
                      )}
                      name={product.product?.name as string}
                      key={product.id}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      )}
    </section>
  );
};

export default CartView;
