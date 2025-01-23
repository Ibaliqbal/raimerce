import { Badge } from "../ui/badge";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TOrder } from "@/lib/db/schema";
import { calculateTotalWithPromo, convertPrice } from "@/utils/helper";
import { Separator } from "../ui/separator";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

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
    <>
      <Card className="border border-gray-500 rounded-md">
        <Card.Description asLink={false}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl">Code Transaction : {transactionCode}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <HiOutlineDotsVertical className="text-xl" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      isOwner ? `/my/store/orders/${id}` : `/my/order/${id}`
                    }
                    className="cursor-pointer"
                  >
                    Detail
                  </Link>
                </DropdownMenuItem>
                {status === "pending" && !isOwner && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/verification_payment?orderId=${id}`}
                      className="cursor-pointer"
                    >
                      Pay
                    </Link>
                  </DropdownMenuItem>
                )}
                {status === "pending" && !isOwner && (
                  <DropdownMenuItem>Cancel</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card.Description>
        <Separator className="my-2" />
        <div className="grid grid-cols-2 gap-3">
          {products?.map((product, i) => (
            <Card className="border border-gray-500 rounded-md" key={i}>
              {product.productVariant?.medias[0].type === "image" ? (
                <Card.Image
                  src={product.productVariant.medias[0].url}
                  className="h-[300px]"
                />
              ) : (
                <Card.Image src="/Background.jpeg" className="h-[300px]" />
              )}
              <Card.Description asLink={false}>
                <h1 className="font-semibold">{product.productName}</h1>
                <p>
                  Price :{" "}
                  {convertPrice(
                    product.quantity * (product.productVariant?.price ?? 0)
                  )}
                </p>
                <p>Quantity : {product.quantity}</p>
                <p>variant : {product.productVariant?.name_variant}</p>
              </Card.Description>
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
            {convertPrice(
              calculateTotalWithPromo({ products }, { promoCodes })
            )}
          </p>
        </Card.Footer>
      </Card>
    </>
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
