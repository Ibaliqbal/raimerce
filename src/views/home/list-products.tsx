import CardProduct from "@/components/card/card-product";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";

const ListProducts = () => {
  const { isLoading, data } = useQuery<
    Array<Pick<TProducts, "id" | "description" | "name" | "rating" | "variant">>
  >({
    queryKey: ["products-recomendations"],
    queryFn: async () =>
      (await instance.get("/products?_type=recomendations")).data.data,
  });

  return (
    <div className="w-full grid grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <CardProduct.Skeleton key={i} />
          ))
        : data?.map((product, i) => (
            <CardProduct key={i} {...product} />
          ))}
    </div>
  );
};

export default ListProducts;
