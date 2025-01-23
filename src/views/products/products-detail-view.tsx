import { convertPrice } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { BsCart } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaMinus, FaPlus, FaUser } from "react-icons/fa";
import ProductsListComment from "@/components/products/products-list-comment";
import ProductsListVariant from "@/components/products/products-list-variant";
import { toast } from "sonner";
import ProductsDetailImage from "@/components/products/products-detail-image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Rating } from "@smastrom/react-rating";
import { styleReactRating } from "@/utils/constant";
import Link from "next/link";
import { TComment, TProducts, TStore, TUser } from "@/lib/db/schema";
import { RiLoader5Line } from "react-icons/ri";
import instance from "@/lib/axios/instance";
import { VariantSchemaT } from "@/types/product";
import { AxiosError } from "axios";

type Props = Pick<
  TProducts,
  "id" | "description" | "name" | "rating" | "variant" | "storeId" | "category"
> & {
  productsCount: number;
  followersCount: number;
  store: Pick<TStore, "name"> | null;
  selectedVariant: string;
  comments: Array<
    Pick<
      TComment,
      "content" | "createdAt" | "id" | "medias" | "rating" | "variant"
    > & {
      user: Pick<TUser, "name"> | null;
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
    <section className="w-full flex gap-4 relative">
      <ProductsDetailImage
        medias={variant
          .flatMap((vari) => vari.medias)
          .filter((vari) => vari.type === "image")}
      />
      <section className="w-[60%] flex flex-col gap-5">
        <h1 className="text-2xl">{name}</h1>
        <div className="flex items-end">
          <div className="text-3xl font-bold ">
            {convertPrice(selectedVariant.price)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Rating
            readOnly
            value={rating as number}
            style={{
              maxWidth: 120,
              marginBottom: ".5rem",
              marginTop: ".5rem",
            }}
            itemStyles={styleReactRating}
          />
          <p className="text-lg">{rating?.toFixed(2)}</p>
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
              <span>{quantity}</span>
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
                src="/Background.jpeg"
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
          <Button className="self-start " size="lg">
            Follow
          </Button>
        </div>
        <ProductsListComment datas={comments} />
        <div className="flex flex-col gap-4">
          <h3 className="text-xl">Description</h3>
          <div className="flex flex-col gap-2">
            <p
              className={cn(
                "transition-all duration-300 ease-linear",
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
