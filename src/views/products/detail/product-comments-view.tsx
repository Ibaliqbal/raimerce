import Carousel from "@/components/ui/carousel";
import Image from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { TMedia } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Rating from "@/components/ui/rating";
import ListComments from "./list-comments";

const ProductCommentsView = () => {
  const { query } = useRouter();
  const { data, isLoading } = useQuery<
    Pick<TProducts, "id" | "name" | "category" | "rating" | "soldout"> & {
      medias: Array<TMedia>;
    }
  >({
    queryKey: ["product-detail-comment", query.id],
    queryFn: async () => {
      if (!query.id) return null;
      return (
        await instance.get(`/products/${query.id}/comments/detail_product`)
      ).data.data;
    },
    retry: false,
  });

  return (
    <main className="wrapper-page flex flex-col gap-6 pb-8">
      {isLoading ? (
        <article className="flex items-center mb-4 gap-4">
          <Skeleton className="md:w-[300px] w-full h-[300px]" />
          <div className="flex-grow md:block hidden">
            <Skeleton className="w-full h-[300px]" />
          </div>
        </article>
      ) : data ? (
        <article className="flex items-center md:mb-4 gap-4">
          <Carousel
            effect="fade"
            thumb={false}
            className="md:w-[300px] md:h-[300px] w-[150px] h-[150px]"
          >
            {data?.medias.map((media: TMedia) => (
              <Image
                key={media.keyFile}
                src={media.url}
                alt={media.name}
                width={200}
                height={200}
                figureClassName="w-full h-full relative md:rounded-md overflow-hidden"
                className="w-full h-full absolute inset-0 md:rounded-md object-cover object-ccnter group-hover:scale-110 transition-transform duration-300 ease-in-out"
              />
            ))}
          </Carousel>
          <div className="flex-grow self-start">
            <h1 className="md:text-3xl text-lg font-bold">{data?.name}</h1>
            <div className="flex items-center gap-2">
              <Rating readOnly value={Number(data?.rating)} />
              <p className="md:text-lg text-sm">
                {Number(data?.rating).toFixed(2)}
              </p>
            </div>
            <p className="text-base">
              <strong>Category</strong> : {data?.category}
            </p>
            <p className="text-base">
              <strong>Soldout</strong> : {data?.soldout}
            </p>
          </div>
        </article>
      ) : (
        <p>Product not found</p>
      )}
      <Separator />
      <ListComments id={query.id as string} />
    </main>
  );
};

export default ProductCommentsView;
