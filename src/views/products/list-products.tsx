import CardProduct from "@/components/card/card-product";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { pageSizeProduct } from "@/utils/constant";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const ListProducts: React.FunctionComponent = () => {
  const { query } = useRouter();

  const { data, isLoading } = useQuery<
    Array<Pick<TProducts, "rating" | "description" | "id" | "name" | "variant">>
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
          }${categoryQuery}${ratingQuery}&page=${page}&limit=${[
            pageSizeProduct,
          ]}`
        : `/products?_type=all${categoryQuery}${ratingQuery}&page=${page}&limit=${pageSizeProduct}`;

      const res = await instance.get(endpoint);
      return res.data.data;
    },
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  return (
    <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <CardProduct.Skeleton key={i} />
        ))
      ) : data?.length ?? 0 > 0 ? (
        data?.map((product, i) => (
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
            key={i}
          >
            <CardProduct {...product} />
          </motion.div>
        ))
      ) : (
        <section className="col-span-4 flex items-center justify-center">
          <h1 className="text-xl italic">Products not found</h1>
        </section>
      )}
    </div>
  );
};

export default ListProducts;
