import Carousel from "@/components/ui/carousel";
import Image from "@/components/ui/image";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Video from "@/components/ui/video";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { TMedia } from "@/types/product";
import { styleReactRating } from "@/utils/constant";
import { Rating } from "@smastrom/react-rating";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const ProductCommentsView = () => {
  const { query } = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useQuery<
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
  if (isLoadingProduct) return <Loader />;
  return (
    <main className="wrapper-page flex flex-col gap-6">
      {isLoadingProduct ? (
        <article className="flex items-center mb-4 gap-4">
          <Skeleton className="w-[300px] h-[300px]" />
          <div className="flex-grow">
            <Skeleton className="w-full h-[300px]" />
          </div>
        </article>
      ) : (
        <article className="flex items-center mb-4 gap-4">
          <Carousel effect="fade" thumb={false} className="w-[300px] h-[300px]">
            {product?.medias.map((media: TMedia) =>
              media.type === "image" ? (
                <Image
                  key={media.keyFile}
                  src={media.url}
                  alt={media.name}
                  width={200}
                  height={200}
                  figureClassName="w-full h-full relative rounded-md overflow-hidden"
                  className="w-full h-full absolute inset-0 rounded-md object-cover object-ccnter group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              ) : (
                <Video
                  key={media.keyFile}
                  src={media.url}
                  aria-label={media.name}
                  autoPlay
                  muted
                  loop
                  className="rounded-md absolute w-full h-full object-contain object-center"
                />
              )
            )}
          </Carousel>
          <div className="flex-grow self-start">
            <h1 className="text-3xl font-bold">{product?.name}</h1>
            <div className="flex items-center gap-2">
              <Rating
                readOnly
                value={Number(product?.rating)}
                style={{
                  maxWidth: 120,
                  marginBottom: ".5rem",
                  marginTop: ".5rem",
                }}
                itemStyles={styleReactRating}
              />
              <p className="text-lg">{Number(product?.rating).toFixed(2)}</p>
            </div>
            <p className="text-base">
              <strong>Category</strong> : {product?.category}
            </p>
            <p className="text-base">
              <strong>Soldout</strong> : {product?.soldout}
            </p>
          </div>
        </article>
      )}
      <Separator />
      <section>Hello</section>
    </main>
  );
};

export default ProductCommentsView;
