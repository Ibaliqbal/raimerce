import CardProduct from "@/components/card/card-product";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { ApiResponse } from "@/utils/api";
import { pageSize } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from "next/router";
import React from "react";

const ListProducts: React.FunctionComponent = () => {
  const { query } = useRouter();

  const { data, isLoading } = useQuery<
    ApiResponse & {
      data: Array<
        Pick<TProducts, "rating" | "description" | "id" | "name" | "variant">
      >;
    }
  >({
    queryKey: [
      "all-products",
      query.c ? query.c : "without-category-filter",
      query.r ? query.r : "without-rating-filter",
      query.q ? query.q : "without-search-filter",
      `page=${query.page}`,
    ],
    queryFn: async () => {
      // Menentukan endpoint berdasarkan query
      const categoryQuery = query.c ? `&c=${query.c}` : "";
      const ratingQuery = query.r ? `&r=${query.r}` : "";
      const page = query.page;
      const endpoint = query.q
        ? `/products/search?q=${
            query.q
          }${categoryQuery}${ratingQuery}&page=${page}&limit=${[pageSize]}`
        : `/products?_type=all${categoryQuery}${ratingQuery}&page=${page}&limit=${pageSize}`;

      const res = await instance.get(endpoint);
      return res.data;
    },
    enabled: !!query,
  });

  return (
    <div className="w-full grid grid-cols-4 gap-4">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <CardProduct.Skeleton key={i} />
        ))
      ) : data?.data.length ?? 0 > 0 ? (
        <AnimatePresence mode="popLayout">
          {data?.data.map((product, i) => (
            <motion.div layout className="relative" key={i}>
              <CardProduct {...product} />
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <section className="col-span-4 flex items-center justify-center">
          <h1 className="text-xl italic">Products not found</h1>
        </section>
      )}
    </div>
  );
};

export default ListProducts;
