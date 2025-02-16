import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios/instance";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";

const ProductsChart = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["products", "chart"],
    queryFn: async () =>
      (await instance.get("/admin/dashboard?type=products_chart")).data.data,
  });

  if (isLoading) return <Skeleton className="w-full h-[250px]" />;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <Card.Description asLink={false}>
          <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
          <Bar
            data={{
              labels: data.map(
                (product: { name: string; total: number }) => product.name
              ),
              datasets: [
                {
                  label: "Products by Category",
                  data: data.map(
                    (product: { name: string; total: number }) => product.total
                  ),
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
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Invoice for this year",
                  position: "bottom",
                  fullSize: true,
                },
                legend: {
                  display: false,
                },
                tooltip: {
                  mode: "nearest",
                  intersect: false,
                },
              },
            }}
          />
        </Card.Description>
      </Card>
    </motion.div>
  );
};

export default ProductsChart;
