import CardProduct from "@/components/card/card-product";
import FilterBySelect from "@/components/filter/filter-by-select";
import { Button } from "@/components/ui/button";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { categories } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";

const StoreProductsView = () => {
  const { query } = useRouter();
  const { data, isLoading } = useQuery<
    Array<Pick<TProducts, "id" | "name" | "description" | "rating" | "variant">>
  >({
    queryKey: [
      "store-products-owner",
      query.c ? query.c : "without-filtering-category",
    ],
    queryFn: async () =>
      (
        await instance.get(
          `/users/login/store/products${query.c ? `?c=${query.c}` : ""}`
        )
      ).data.data,
    retry: false,
    staleTime: 60000, // 1 minute
    enabled: !!query,
  });

  return (
    <section className="col-span-2 flex flex-col gap-5">
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
      <div className="w-full grid grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <CardProduct.Skeleton key={i} />
            ))
          : data?.map((product) => (
              <CardProduct key={product.id} hisMine {...product} />
            ))}
      </div>
    </section>
  );
};

export default StoreProductsView;
