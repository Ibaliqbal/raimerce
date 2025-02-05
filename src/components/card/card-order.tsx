import { Badge } from "../ui/badge";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TOrder } from "@/lib/db/schema";
import { calculateTotalWithPromo, convertPrice } from "@/utils/helper";
import { Separator } from "../ui/separator";
import DropdownOrder from "../dropdown/dropdown-order";

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
          <h1 className="text-xl">Code Transaction : {transactionCode}</h1>
          <DropdownOrder
            id={id}
            isOwner={isOwner}
            status={status}
            products={products}
          />
        </div>
      </Card.Description>
      <Separator className="my-2" />
      <div className="grid grid-cols-2 gap-3">
        {products?.map((product) => (
          <Card
            className="border border-gray-500 rounded-md"
            key={product.productID}
          >
            {product.productVariant?.medias[0].type === "image" ? (
              <Card.Image
                src={product.productVariant.medias[0].url}
                className="h-[300px]"
              />
            ) : (
              <Card.Video
                videoProps={{
                  src: product.productVariant?.medias[0].url,
                }}
                className="h-[300px]"
              />
            )}
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
            </Card.Description>
            <Card.Footer>
              <div>
                <div className="flex items-center gap-1">
                  <strong>Status</strong> :{" "}
                  <Badge
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
                </div>
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>
      <Separator className="my-2" />
      <Card.Footer>
        <div className="flex items-center justify-center gap-2 py-2">
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
