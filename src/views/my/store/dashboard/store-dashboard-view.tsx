import {
  Chart as ChartJs,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  ArcElement,
} from "chart.js";
import { Button } from "@/components/ui/button";
import CardStoreNews from "@/components/card/card-store-news";
import Link from "next/link";
import FollowersChart from "@/components/store/chart/followers-chart";
import InvoiceChart from "@/components/store/chart/invoice-chart";
import PopularProductsChart from "@/components/store/chart/popular-products-chart";
import { useGetStoreOwner } from "@/context/store-context";
import Loader from "@/components/ui/loader";

ChartJs.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StoreDashboardView = () => {
  const data = useGetStoreOwner();

  if (data?.loading) return <Loader className="col-span-2" />;

  return (
    <section className="col-span-2 flex flex-col gap-4 pb-16">
      <h1 className="text-3xl">👋 Welcome back {data?.store?.owner?.name}</h1>
      <InvoiceChart />
      <PopularProductsChart />
      <FollowersChart />
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl">Your latest news</h2>
          <Button asChild>
            <Link href={"/my/store/news/create"}>Create news</Link>
          </Button>
        </div>
        {data?.store?.news.length ?? 0 > 0 ? (
          <div className="flex flex-col gap-4">
            {data?.store?.news.map((news) => (
              <CardStoreNews
                key={news.id}
                isOwner
                {...news}
                handleDelete={(id: string) => data.handleDeleteNews.mutate(id)}
                disabled={data.handleDeleteNews.isPending}
              />
            ))}
            {data?.store?.news.length === 3 ? (
              <Button asChild variant="link" className="w-fit self-center">
                <Link href={"/my/store/news"}>More news</Link>
              </Button>
            ) : null}
          </div>
        ) : (
          <h3 className="text-center text-xl mt-10">
            Create your news about your store...
          </h3>
        )}
      </div>
    </section>
  );
};

export default StoreDashboardView;
