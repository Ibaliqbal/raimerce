import Card from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { TPromo } from "@/lib/db/schema";
import DropdownPromo from "../dropdown/dropdown-promo";

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
      <DropdownPromo id={id} />
      <Card.Icon
        src="/icon/discount-voucher-icon.png"
        className="md:h-[150px] h-[100px]"
      />
      <Card.Description asLink={false} className="md:text-base text-sm">
        <h2>
          <strong>Code Promo</strong> : {code}
        </h2>
        <p>
          <strong>Expire</strong> : {expiredAt}
        </p>
        <p>
          <strong>Uses</strong> : {uses}
        </p>
      </Card.Description>
    </Card>
  );
};

const CardPromoSkeleton = () => {
  return (
    <Card className="border border-gray-500 rounded-xl">
      <Skeleton className="w-full md:h-[200px] h-[100px]" />
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
