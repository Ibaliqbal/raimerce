import Card from "@/components/ui/card";
import React from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { Skeleton } from "@/components/ui/skeleton";

const RevenueChart = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["revenue"],
    queryFn: async () => {
      const data = (await instance.get("/admin/dashboard?type=revenue_chart"))
        .data.data;
      return {
        labels: data.map(
          (data: { month: string; total: number }) => data.month
        ),
        datasets: [
          {
            label: "Revenue",
            data: data.map(
              (data: { month: string; total: number }) => data.total
            ),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
    },
  });

  if (isLoading) return <Skeleton className="w-full h-[250px]" />;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <Card.Description asLink={false}>
          <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
          <Line
            data={{
              labels: data?.labels,
              datasets: [
                {
                  label: "Revenue",
                  data: data?.datasets[0].data,
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 2,
                  fill: true,
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

export default RevenueChart;
