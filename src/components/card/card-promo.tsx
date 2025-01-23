import Card from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { TPromo } from "@/lib/db/schema";
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

type Props = Pick<
  TPromo,
  "amount" | "code" | "id" | "uses" | "productsAllowed" | "expiredAt"
>;

const CardPromo = ({ code, uses, expiredAt, id }: Props) => {
  return (
    <Card
      className={`border ${
        new Date().getTime() > new Date(expiredAt).getTime()
          ? "border-red-600"
          : "border-gray-500"
      } rounded-xl`}
    >
      <div className="self-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <HiOutlineDotsVertical className="text-xl" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/my/store/promo/${encodeURIComponent(id)}/update`}
                className="cursor-pointer"
              >
                Update
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card.Icon src="/icon/discount-voucher-icon.png" className="h-[150px]" />
      <Card.Description asLink={false}>
        <h2>Code Promo : {code}</h2>
        <p>Expire : {expiredAt}</p>
        <p>Uses : {uses}</p>
      </Card.Description>
    </Card>
  );
};

const CardPromoSkeleton = () => {
  return (
    <Card className="border border-gray-500 rounded-xl">
      <Skeleton className="w-full h-[200px]" />
      <Card.Description asLink={false}>
        <Skeleton className="w-full h-[20px]" />
        <Skeleton className="w-full h-[20px]" />
        <Skeleton className="w-full h-[20px]" />
      </Card.Description>
    </Card>
  );
};

CardPromo.Skeleton = CardPromoSkeleton;

export default CardPromo;
