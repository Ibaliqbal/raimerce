import { Badge } from "../ui/badge";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TOrder } from "@/lib/db/schema";
import { calculateTotalWithPromo, convertPrice } from "@/utils/helper";
import { Separator } from "../ui/separator";
import DropdownOrder from "../dropdown/dropdown-order";
import DropdownProductOrder from "../dropdown/dropdown-product-order";

const CardOrder = ({
  transactionCode,
  status,
  products,
  id,
  isOwner = false,
  promoCodes,
}: Pick<
  TOrder,
  "id" | "products" | "transactionCode" | "status" | "promoCodes"
> & {
  isOwner?: boolean;
}) => {
  return (
    <Card className="border border-gray-500 rounded-md">
      <Card.Description asLink={false}>
        <div className="flex items-center justify-between">
          <h1 className="md:text-xl text-lg flex md:flex-row flex-col">
            <span>Code Transaction :</span> <span> {transactionCode}</span>
          </h1>
          <DropdownOrder
            id={id}
            isOwner={isOwner}
            status={status}
            products={products}
          />
        </div>
      </Card.Description>
      <Separator className="my-2" />
      <div className="flex flex-col gap-3">
        {products?.map((product, i) => (
          <Card className="border border-gray-500 rounded-md p-3" key={i}>
            <div className="flex md:flex-row flex-col gap-4">
              <Card.Image
                src={product.productVariant?.medias[0].url as string}
                className="md:h-[200px] md:w-[200px] w-full aspect-square"
              />
              <div className="grow">
                <Card.Description asLink={false}>
                  <h1 className="font-semibold">{product.productName}</h1>
                  <p>
                    <strong>Price</strong> :{" "}
                    {convertPrice(
                      product.quantity * (product.productVariant?.price ?? 0)
                    )}
                  </p>
                  <p>
                    <strong>Quantity</strong> : {product.quantity}
                  </p>
                  <p>
                    <strong>Variant</strong> :{" "}
                    {product.productVariant?.name_variant}
                  </p>
                  <Badge
                    className="w-fit"
                    size="md"
                    variant={
                      product.status === "not-confirmed"
                        ? "canceled"
                        : product.status === "confirmed"
                        ? "pending"
                        : "success"
                    }
                  >
                    {product.status.charAt(0).toUpperCase() +
                      product.status.slice(1).split("-").join(" ")}
                  </Badge>
                </Card.Description>
              </div>
              {!isOwner &&
                status === "success" &&
                product.status === "confirmed" && (
                  <DropdownProductOrder
                    orderID={id}
                    productID={(product.productID as string) || ""}
                    productName={(product.productName as string) || ""}
                    productVariant={
                      (product.productVariant?.name_variant as string) || ""
                    }
                    imageVariant={
                      product.productVariant?.medias[0].url as string
                    }
                  />
                )}
            </div>
          </Card>
        ))}
      </div>
      <Separator className="my-2" />
      <Card.Footer className="md:flex-row flex-col gap-3">
        <div className="flex items-center md:justify-center gap-2 py-2">
          <p>Payment Status</p>
          <p>:</p>
          <Badge size="md" variant={status}>
            {status}
          </Badge>
        </div>
        <p className="text-xl">
          <strong>Total</strong> :{" "}
          {convertPrice(calculateTotalWithPromo({ products }, { promoCodes }))}
        </p>
      </Card.Footer>
    </Card>
  );
};

const CardOrderSkeleton = () => {
  return (
    <Card className="border border-gray-500 rounded-md">
      <Skeleton className="h-[50px] w-full" />
      <Skeleton className="h-[250px] w-full" />
      <Skeleton className="h-[25px] w-full" />
    </Card>
  );
};

CardOrder.Skeleton = CardOrderSkeleton;

export default CardOrder;
