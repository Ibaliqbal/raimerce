import CardStoreNews from "@/components/card/card-store-news";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { TNews } from "@/lib/db/schema";
import Loader from "@/components/ui/loader";
import { toast } from "react-hot-toast";

const keyQuery = "store-news-owner";

const StoreNewsView = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) =>
      await instance.delete(`/users/login/store/news/${id}`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [keyQuery],
      });
      toast.success(res.data.message);
    },
  });
  const { data, isLoading } = useQuery<
    Array<Pick<TNews, "content" | "createdAt" | "id" | "medias">>
  >({
    queryKey: [keyQuery],
    queryFn: async () =>
      (await instance.get("/users/login/store/news")).data.data,
    retry: false,
  });

  if (isLoading) return <Loader className="col-span-2" />;

  return (
    <section className="flex flex-col gap-4 col-span-2">
      <Button
        className="self-start flex items-center gap-3"
        variant="icon"
        onClick={() => router.back()}
      >
        <FaArrowLeft />
        Back
      </Button>
      {data?.map((news) => (
        <CardStoreNews
          key={news.id}
          {...news}
          handleDelete={(id: string) => mutation.mutate(id)}
          isOwner
          disabled={mutation.isPending}
        />
      ))}
    </section>
  );
};

export default StoreNewsView;
