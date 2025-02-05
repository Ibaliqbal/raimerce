import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios/instance";
import { convertPrice } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";

const InvoiceChart = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["invoice"],
    queryFn: async () =>
      (await instance.get("/users/login/store/invoice")).data,
  });
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Invoice</h2>
      {isLoading ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <p className="text-3xl">{convertPrice(data.total)}</p>
      )}
      {isLoading ? (
        <Skeleton className="w-full h-[350px]" />
      ) : (
        <Line
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Invoice store for this year",
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
          data={{
            labels: data.data.map(
              (invoice: { month: string; total: number }) => invoice.month
            ),
            datasets: [
              {
                fill: true,
                label: "Invoice",
                data: data.data.map(
                  (invoice: { month: string; total: number }) => invoice.total
                ),
                borderColor: "rgba(12, 227, 9, 0.5)",
                borderWidth: 2,
                backgroundColor: "rgba(12, 227, 9, 0.2)",
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default InvoiceChart;
