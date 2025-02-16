import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";

const PopularProductsChart = () => {
  const { isLoading, data } = useQuery<
    Array<Pick<TProducts, "name" | "soldout">>
  >({
    queryKey: ["most", "products", "by selling"],
    queryFn: async () =>
      (await instance.get("/users/login/store/products/selling")).data.data,
  });
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semiboldl">Most selling products</h2>
      {isLoading ? (
        <Skeleton className="w-full h-[350px]" />
      ) : (
        <Bar
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Three popular products (most purchased) per month for this year",
                position: "bottom",
                fullSize: true,
              },
              legend: {
                display: false,
              },
              tooltip: {
                mode: "point",
                intersect: false,
              },
            },
          }}
          data={{
            labels: data?.map((product) => product.name),
            datasets: [
              {
                label: "Soldout",
                data: data?.map((product) => product.soldout),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                ],
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default PopularProductsChart;
