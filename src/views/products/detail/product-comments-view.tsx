import Carousel from "@/components/ui/carousel";
import Image from "@/components/ui/image";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { TMedia } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Rating from "@/components/ui/rating";
import { TComment } from "@/lib/db/schema";
import CardComment from "@/components/card/card-comment";

const exampleData: TComment[] = [
  {
    id: "1",
    content: "Ini adalah komentar pertama.",
    medias: [
      {
        name: "Gambar 1",
        keyFile: "file1.jpg",
        url: "/Background.jpeg",
        type: "image",
      },
    ],
    createdAt: new Date("2023-01-01T12:00:00Z"),
    userId: "user1",
    variant: "default",
    rating: "5",
    productId: "product1",
  },
  {
    id: "2",
    content: "hahahha",
    medias: null,
    createdAt: new Date("2023-01-02T12:00:00Z"),
    userId: "user2",
    variant: "default",
    rating: "4",
    productId: "product2",
  },
  {
    id: "3",
    content: "Komentar ketiga, sangat menarik!",
    medias: [
      {
        name: "Video 1",
        keyFile: "video1.mp4",
        url: "/Background.jpeg",
        type: "image",
      },
    ],
    createdAt: new Date("2023-01-03T12:00:00Z"),
    userId: "user3",
    variant: null,
    rating: "3",
    productId: "product3",
  },
];

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
    <main className="wrapper-page flex flex-col gap-6 pb-8">
      {isLoadingProduct ? (
        <article className="flex items-center mb-4 gap-4">
          <Skeleton className="w-[300px] h-[300px]" />
          <div className="flex-grow">
            <Skeleton className="w-full h-[300px]" />
          </div>
        </article>
      ) : (
        <article className="flex items-center md:mb-4 gap-4">
          <Carousel
            effect="fade"
            thumb={false}
            className="md:w-[300px] md:h-[300px] w-[150px] h-[150px]"
          >
            {product?.medias.map((media: TMedia) => (
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
            <h1 className="md:text-3xl text-lg font-bold">{product?.name}</h1>
            <div className="flex items-center gap-2">
              <Rating readOnly value={Number(product?.rating)} />
              <p className="md:text-lg text-sm">
                {Number(product?.rating).toFixed(2)}
              </p>
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
      <section className="flex flex-col gap-4">
        {exampleData.map((data) => (
          <CardComment key={data.id} {...data} />
        ))}
      </section>
    </main>
  );
};

export default ProductCommentsView;
