import { convertPrice } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { BsCart } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaMinus, FaPlus, FaUser } from "react-icons/fa";
import ProductsListComment from "@/components/products/products-list-comment";
import ProductsListVariant from "@/components/products/products-list-variant";
import { toast } from "react-hot-toast";
import ProductsDetailImage from "@/components/products/products-detail-image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/rating";
import Link from "next/link";
import { TComment, TProducts, TStore, TUser } from "@/lib/db/schema";
import { RiLoader5Line } from "react-icons/ri";
import instance from "@/lib/axios/instance";
import { VariantSchemaT } from "@/types/product";
import { AxiosError } from "axios";
import ButtonFollow from "@/components/button/button-follow";
const NumberFlow = dynamic(() => import("@number-flow/react"), {
  ssr: false,
});

type Props = Pick<
  TProducts,
  "id" | "description" | "name" | "rating" | "variant" | "storeId" | "category"
> & {
  productsCount: number;
  followersCount: number;
  store: Pick<TStore, "name" | "id"> & {
    owner: Pick<TUser, "avatar">;
  };
  selectedVariant: string;
  comments: Array<
    Pick<
      TComment,
      "content" | "createdAt" | "id" | "medias" | "rating" | "variant"
    > & {
      user: Pick<TUser, "name" | "avatar"> | null;
    }
  >;
};

const ProductsDetailView = ({
  name,
  description,
  productsCount,
  store,
  id,
  variant,
  category,
  selectedVariant: variantProps,
  comments,
  rating,
  followersCount,
}: Props) => {
  const [readMore, setReadMore] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant] = useState<VariantSchemaT>(
    variant.find((vari) => vari.name_variant === variantProps)!
  );
  const [status, setStatus] = useState<{
    status: "success" | "submitting" | " error";
    type: "cart" | "checkout";
  }>({
    status: "success",
    type: "cart",
  });

  return (
    <section className="w-full flex lg:flex-row flex-col gap-4 relative">
      <ProductsDetailImage
        medias={variant
          .flatMap((vari) => vari.medias)
          .filter((vari) => vari.type === "image")}
      />
      <section className="lg:w-[60%] w-full flex flex-col gap-5">
        <h1 className="text-4xl font-semibold">{name}</h1>
        <div className="flex items-end">
          <div className="text-3xl font-bold ">
            {convertPrice(selectedVariant.price)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Rating readOnly value={Number(rating)} />
          <p className="text-lg">{Number(rating).toFixed(2)}</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3>Variants</h3>
          <ProductsListVariant
            defaultVariant={selectedVariant}
            withCustomSelected
            lists={variant}
            productId={id}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h3>Quantity</h3>
          {selectedVariant.stock <= 0 ? (
            <p className="italic line-through">Stock not available</p>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="icon"
                disabled={quantity === 1}
                onClick={() => setQuantity((prev) => --prev)}
              >
                <FaMinus />
              </Button>
              <NumberFlow value={quantity} willChange />
              <Button
                size="icon"
                variant="icon"
                onClick={() => setQuantity((prev) => ++prev)}
                disabled={quantity === selectedVariant.stock}
              >
                <FaPlus />
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="xl"
          className="flex items-center gap-3 text-xl"
          disabled={status.status === "submitting"}
          onClick={async () => {
            setStatus({
              status: "submitting",
              type: "cart",
            });
            try {
              const res = await instance.post("/carts", {
                productId: id,
                quantity,
                category,
                variant: selectedVariant.name_variant,
              });
              setStatus((prev) => ({
                status: "success",
                type: prev.type,
              }));
              toast.success(res.data.message);
            } catch (error) {
              if (error instanceof AxiosError) {
                toast.error(error.message);
              }
              setStatus((prev) => ({
                status: " error",
                type: prev.type,
              }));
            }
          }}
        >
          {status.status === "submitting" && status.type === "cart" ? (
            <RiLoader5Line className="animate-spin" />
          ) : (
            <BsCart />
          )}
          Add cart
        </Button>
        <div className="flex gap-4 items-center text-lg">
          <Link
            href={`/store/${encodeURIComponent(store?.name as string)}`}
            className="flex flex-col gap-3 items-center"
          >
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={store.owner.avatar?.url}
                alt="Avatar"
                className="object-cover object-center"
              />
              <AvatarFallback>
                <FaUser />
              </AvatarFallback>
            </Avatar>
            <p className="font-bold">{store?.name}</p>
          </Link>
          <div className="self-start flex flex-col gap-3 text-base">
            <p>
              <strong>Follower</strong> : {followersCount}
            </p>
            <p>
              <strong>Products</strong> : {productsCount}
            </p>
          </div>
          <ButtonFollow id={store?.id || ""} className="self-start" />
        </div>
        <ProductsListComment datas={comments} id={id} />
        <div className="flex flex-col gap-4">
          <h3 className="text-xl">Description</h3>
          <div className="flex flex-col gap-2">
            <p
              className={cn(
                "transition-all duration-300 ease-linear text-justify",
                readMore ? "" : "line-clamp-4"
              )}
            >
              {description}
            </p>
            <Button
              variant="icon"
              size="sm"
              onClick={() => setReadMore((prev) => !prev)}
            >
              {readMore ? "Close" : "Read more"}
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default ProductsDetailView;
