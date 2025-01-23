import CardStoreNews from "@/components/card/card-store-news";
import instance from "@/lib/axios/instance";
import { TNews } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const StoreNewsView = () => {
  const { query } = useRouter();
  const { isLoading, data } = useQuery<
    Array<Pick<TNews, "content" | "createdAt" | "id" | "medias">>
  >({
    queryKey: ["store-news-owner", query.name],
    queryFn: async () =>
      (await instance.get(`/stores/${query.name}/news`)).data.data,
    // Cache settings
    staleTime: 60 * 60 * 1000,
  });
  return (
    <section className="flex flex-col gap-5 col-span-2 pb-10">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <CardStoreNews.Skeleton key={i} />
        ))
      ) : data?.length ?? 0 > 0 ? (
        data?.map((news, i) => (
          <CardStoreNews handleDelete={() => {}} key={i} {...news} />
        ))
      ) : (
        <h1 className="text-center text-xl">
          No news available for this store...
        </h1>
      )}
    </section>
  );
};

export default StoreNewsView;
