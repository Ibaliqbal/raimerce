import CardProduct from "@/components/card/card-product";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const StoreListProducts = () => {
  const { query } = useRouter();
  const { isLoading, data } = useQuery<
    Array<Pick<TProducts, "id" | "description" | "name" | "rating" | "variant">>
  >({
    queryKey: [
      "store-products-owner",
      query.name,
      query.r ? query.r : "without rating filter",
      query.c ? query.c : "without category filter",
    ],
    queryFn: async () => {
      const { c, r, name } = query;
      let endpoint = `/stores/${name}/products`;

      const params = new URLSearchParams();
      if (c) params.append("c", c as string);
      if (r) params.append("r", r as string);

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const res = (await instance.get(endpoint)).data.data;
      return res;
    },
    enabled: !!query,
    refetchInterval: 60 * 60 * 1000, // 1 hour
  });

  return (
    <div className="w-full grid grid-cols-4 gap-4">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <CardProduct.Skeleton key={i} />
        ))
      ) : data?.length ?? 0 > 0 ? (
        data?.map((product) => <CardProduct key={product.id} {...product} />)
      ) : (
        <div className="col-span-4">
          <p className="text-center text-xl italic">
            Product{"'"}s not available
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreListProducts;
