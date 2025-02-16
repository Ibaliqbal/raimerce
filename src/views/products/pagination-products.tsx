import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios/instance";
import { pageSizeProduct } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
const PaginationProducts = () => {
  const { asPath, query } = useRouter();
  const { isLoading, data } = useQuery({
    queryKey: [
      "total",
      "products",
      query.c ? query.c : "without-category-filter",
      query.r ? query.r : "without-rating-filter",
      query.q ? query.q : "without-search-filter",
    ],
    queryFn: async () => {
      const categoryQuery = query.c ? `&c=${query.c}` : "";
      const ratingQuery = query.r ? `&r=${query.r}` : "";
      const endpoint = query.q
        ? `/products/search?q=${query.q}${categoryQuery}${ratingQuery}&type=total`
        : `/products?_type=total${categoryQuery}${ratingQuery}`;
      const res = (await instance.get(endpoint)).data.data;
      return res;
    },
    enabled: !!query,
  });
  return (
    <div className="w-full flex items-center justify-center">
      {isLoading ? (
        <Skeleton className="h-8 w-[200px]" />
      ) : Math.ceil(data / pageSizeProduct) <= 1 ? null : (
        <Pagination>
          <PaginationContent>
            <PaginationItem
              className={Number(query["page"]) <= 1 ? "hidden" : ""}
            >
              <PaginationPrevious
                href={asPath.replace(
                  `page=${query["page"]}`,
                  `page=${Number(query["page"]) - 1}`
                )}
              />
            </PaginationItem>
            {Array.from({ length: Math.ceil(data / pageSizeProduct) }).map(
              (_, index) => {
                const page = index + 1;
                const currentPage = Number(query["page"]);

                // Tampilkan halaman pertama, terakhir, dan halaman di sekitar halaman aktif
                if (
                  page === 1 || // Halaman pertama
                  page === Math.ceil(data / pageSizeProduct) || // Halaman terakhir
                  Math.abs(page - currentPage) <= 1 // Halaman sekitar halaman aktif
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={asPath.replace(
                          `page=${query["page"]}`,
                          `page=${page}`
                        )}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Tampilkan ellipsis setelah halaman pertama dan sebelum halaman terakhir
                if (
                  page === 2 ||
                  page === Math.ceil(data / pageSizeProduct) - 1
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              }
            )}
            <PaginationItem
              className={
                Number(query["page"]) >= Math.ceil(data / pageSizeProduct)
                  ? "hidden"
                  : ""
              }
            >
              <PaginationNext
                href={asPath.replace(
                  `page=${query["page"]}`,
                  `page=${Number(query["page"]) + 1}`
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaginationProducts;
