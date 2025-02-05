import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios/instance";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";

const FollowersChart = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["followers", "store"],
    queryFn: async () =>
      (await instance.get("/users/login/store/followers")).data,
  });
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Followers</h2>
      {isLoading ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <p>
          <strong>Total</strong> : {data.total}
        </p>
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
                text: "Your followers store for this year",
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
              (follower: { month: string; total: number }) => follower.month
            ),
            datasets: [
              {
                label: "People",
                data: data.data.map(
                  (follower: { month: string; total: number }) => follower.total
                ),
                borderColor: "rgba(39, 243, 245, 1)",
                borderWidth: 2,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default FollowersChart;
