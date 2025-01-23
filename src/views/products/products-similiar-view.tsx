import CardProduct from "@/components/card/card-product";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type Props = Pick<TProducts, "id">;

const ProductsRelatedView = ({ id }: Props) => {
  const { data, isLoading } = useQuery<
    Array<Pick<TProducts, "id" | "description" | "name" | "rating" | "variant">>
  >({
    queryKey: ["related-products", id],
    queryFn: async () => {
      // Fetch related products based on variant and name
      const response = await instance(`/products/${id}/similar`);

      return response.data.data;
    },
    staleTime: 60 * 1000, // Cache for 1 minute
    enabled: !!id,
  });

  return (
    <section className="w-full">
      <h1 className="text-xl">Similar Products</h1>
      <div className="w-full grid grid-cols-4 gap-4 mt-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <CardProduct.Skeleton key={i} />
            ))
          : data?.map((product) => (
              <CardProduct key={product.id} {...product} />
            ))}
      </div>
    </section>
  );
};

export default ProductsRelatedView;
