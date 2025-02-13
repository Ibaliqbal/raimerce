import { convertPrice } from "@/utils/helper";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import CheckboxCheckout from "../checkbox/checkbox-checkout";
import { VariantSchemaT } from "@/types/product";
import ButtonDeleteCart from "../button/button-delete-cart";
import ButtonQtyCart from "../button/button-qty-cart";
import { Separator } from "../ui/separator";
import dynamic from "next/dynamic";
const NumberFlow = dynamic(() => import("@number-flow/react"), {
  ssr: false,
});

type Props = {
  id: string;
  withAction: boolean;
  quantity: number;
  isCheckout: boolean;
  selectedVariant: VariantSchemaT | undefined;
  name: string;
};

const CardCart = ({
  id,
  withAction,
  name,
  selectedVariant,
  isCheckout,
  quantity,
}: Props) => {
  return (
    <Card
      className="rounded-md border border-gray-500"
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <div className="flex gap-3">
        <Card.Image
          src={selectedVariant?.medias[0].url as string}
          className="md:h-[300px] h-[150px] w-[150px] md:w-[300px]  group"
        />
        <Card.Description asLink={false}>
          <h1 className="md:text-xl text-base font-semibold">{name}</h1>
          <p className="md:text-base text-sm">
            <strong>Price</strong> : {convertPrice(selectedVariant?.price ?? 0)}
          </p>
          <p className="md:text-base text-sm">
            <strong>Variant</strong> : {selectedVariant?.name_variant}
          </p>
          <div className="flex items-center gap-4">
            <ButtonQtyCart id={id} variant="dec" disabled={quantity === 1} />
            <NumberFlow
              value={quantity}
              willChange
              className="md:text-base text-sm"
            />
            <ButtonQtyCart id={id} variant="inc" />
          </div>
        </Card.Description>
      </div>
      <Separator className="my-2" />
      {withAction ? (
        <Card.Footer className="items-center">
          <CheckboxCheckout id={id} isCheckout={isCheckout} />
          <ButtonDeleteCart id={id} />
        </Card.Footer>
      ) : null}
    </Card>
  );
};

const CardCartSkeleton = () => {
  return (
    <Card className="rounded-md border border-gray-500">
      <Skeleton className="h-[250px] w-full" />
      <Skeleton className="h-[40px] w-full" />
      <Skeleton className="h-[25px] w-full" />
    </Card>
  );
};

CardCart.Skeleton = CardCartSkeleton;

export default CardCart;
