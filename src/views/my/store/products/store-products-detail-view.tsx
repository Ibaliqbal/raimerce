import ButtonDeleteProduct from "@/components/button/button-delete-product";
import CardProductVariant from "@/components/card/card-product-variant";
import { Badge } from "@/components/ui/badge";
import Carousel from "@/components/ui/carousel";
import Image from "@/components/ui/image";
import Loader from "@/components/ui/loader";
import instance from "@/lib/axios/instance";
import { TComment, TProducts, TPromo, TUser } from "@/lib/db/schema";
import { TMedia } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const StoreProductsDetail = () => {
  const { query } = useRouter();

  const { isLoading, data, error, isError } = useQuery<
    Pick<TProducts, "category" | "description" | "id" | "name" | "variant"> & {
      promos: Array<Pick<TPromo, "code" | "id">>;
      medias: Array<TMedia>;
      comments: Array<
        Pick<
          TComment,
          "content" | "createdAt" | "id" | "medias" | "rating" | "variant"
        > & {
          user: Pick<TUser, "email" | "avatar">;
        }
      >;
    }
  >({
    queryKey: ["store-product", query.id],
    queryFn: async () =>
      (await instance.get(`/users/login/store/products/${query.id}`)).data.data,
    enabled: !!query.id,
    retry: false,
  });

  if (isLoading) return <Loader className="col-span-2" />;

  if (isError)
    return (
      <section className="col-span-2 w-full flex items-center justify-center">
        <h1>{error.message}</h1>
      </section>
    );

  return (
    <section className="col-span-2 flex flex-col gap-8 pb-10">
      <ButtonDeleteProduct medias={data?.medias ?? []} id={data?.id ?? ""} />
      <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
        <Carousel effect="fade" autoPlay={false}>
          {data?.medias?.map((media) =>
            media.type === "image" ? (
              <Image
                figureClassName="w-full h-full relative rounded-xl"
                width={500}
                height={500}
                className="w-full h-full absolute inset-0 rounded-xl object-cover object-center"
                alt={media.name}
                src={media.url}
                key={media.keyFile}
              />
            ) : (
              <Image
                figureClassName="w-full h-full relative rounded-xl"
                width={500}
                height={500}
                className="w-full h-full absolute inset-0 rounded-xl object-cover object-center"
                alt={media.name}
                src={media.url}
                key={media.keyFile}
              />
            )
          )}
        </Carousel>
      </div>
      <h1 className="text-3xl font-bold">{data?.name}</h1>
      <div className="rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Variants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data?.variant.map((v, i) => (
            <CardProductVariant
              key={v.name_variant}
              {...v}
              i={i}
              handleRemove={() => {}}
            />
          ))}
        </div>
      </div>
      <div className="rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        <p className="text-lg leading-relaxed">{data?.description}</p>
      </div>
      <div className="rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Available Promo Codes</h2>
        <div className="flex mt-4 flex-wrap gap-3">
          {data?.promos.map((promo) => (
            <Badge
              key={promo.id}
              variant="secondary"
              className="text-sm py-1 px-3"
            >
              {promo.code}
            </Badge>
          ))}
        </div>
      </div>
      <div className="rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <div className="flex mt-4 flex-col gap-3">
          {data?.comments.length ?? 0 > 0 ? null : (
            <p className="self-center italic text-lg">Comments not available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default StoreProductsDetail;
