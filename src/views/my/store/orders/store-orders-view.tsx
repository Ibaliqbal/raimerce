import CardOrder from "@/components/card/card-order";
import FilterOrder from "@/components/filter/filter-order";
import instance from "@/lib/axios/instance";
import { TOrder } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";

const StoreOrdersView = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["orders-store"],
    queryFn: async () => {
      const res = await instance.get("/users/login/store/orders");
      return res.data.data;
    },
  });
  return (
    <section className="col-span-2 flex flex-col gap-4">
      <FilterOrder
        lists={["Pending", "Success", "Canceled"]}
        baseRoute="/my/store/orders"
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
            ) => <CardOrder key={order.id} {...order} isOwner />
          )}
    </section>
  );
};

export default StoreOrdersView;
