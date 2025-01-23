import FilterOrder from "@/components/filter/filter-order";
import CardOrder from "@/components/card/card-order";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { TOrder } from "@/lib/db/schema";
import { useRouter } from "next/router";

const OrderView = () => {
  const { query } = useRouter();
  const { isLoading, data } = useQuery({
    queryKey: ["orders", query.status ? query.status : "without status"],
    queryFn: async () =>
      (
        await instance.get(
          query.status ? `/orders?status=${query.status}` : `/orders`
        )
      ).data.data,
    retry: false,
  });

  return (
    <section className="col-span-2 flex flex-col gap-4">
      <FilterOrder
        lists={["Pending", "Success", "Canceled"]}
        baseRoute="/my/order"
      />
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <CardOrder.Skeleton key={i} />
          ))
        : data?.map(
            (
              order: Pick<
                TOrder,
                "id" | "products" | "transactionCode" | "status" | "promoCodes"
              >
            ) => <CardOrder key={order.id} {...order} />
          )}
    </section>
  );
};

export default OrderView;
