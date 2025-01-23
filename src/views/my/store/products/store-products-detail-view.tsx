import CardProductVariant from "@/components/card/card-product-variant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Carousel from "@/components/ui/carousel";
import Image from "@/components/ui/image";
import Loader from "@/components/ui/loader";
import instance from "@/lib/axios/instance";
import { TProducts, TPromo } from "@/lib/db/schema";
import { TMedia } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiLoader5Line } from "react-icons/ri";

const StoreProductsDetail = () => {
  const { query, push } = useRouter();
  const [status, setStatus] = useState<"success" | "error" | "submitting">(
    "success"
  );
  const { isLoading, data, error, isError } = useQuery<
    Pick<TProducts, "category" | "description" | "id" | "name" | "variant"> & {
      promos: Array<Pick<TPromo, "code" | "id">>;
      medias: Array<TMedia>;
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
      <Button
        variant="destructive"
        disabled={status === "submitting"}
        className="self-end flex items-center gap-2 hover:bg-red-600 transition-colors duration-300"
        onClick={async () => {
          setStatus("submitting");
          try {
            const deletes = data?.medias.map(async (media) => {
              await instance.delete(`/products/files/${media.keyFile}`);
              return;
            });

            await Promise.all([
              deletes,
              instance.delete(`/users/login/store/products/${data?.id}`),
            ]);

            setStatus("success");
            push("/my/store/products");
          } catch (error) {
            console.log(error);
            setStatus("error");
          }
        }}
      >
        {status === "submitting" ? (
          <RiLoader5Line className="animate-spin" />
        ) : (
          <FaRegTrashAlt />
        )}
        Delete
      </Button>
      <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
        <Carousel effect="fade" autoPlay={false} pagination={false}>
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
      <h1 className="text-3xl font-bold text-gray-800">{data?.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Variants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Description
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {data?.description}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Available Promo Codes
        </h2>
        <div className="flex mt-4 flex-wrap gap-3">
          {data?.promos.map((promo) => (
            <Badge
              key={promo.id}
              variant="secondary"
              className="text-sm py-1 px-3 bg-blue-100 text-blue-800"
            >
              {promo.code}
            </Badge>
          ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Reviews</h2>
        <div className="flex mt-4 flex-wrap gap-3">
          {data?.promos.map((promo) => (
            <Badge
              key={promo.id}
              variant="secondary"
              className="text-sm py-1 px-3 bg-blue-100 text-blue-800"
            >
              {promo.code}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreProductsDetail;
