import { convertPrice } from "@/utils/helper";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import CheckboxCheckout from "../checkbox/checkbox-checkout";
import { VariantSchemaT } from "@/types/product";
import ButtonDeleteCart from "../button/button-delete-cart";
import ButtonQtyCart from "../button/button-qty-cart";

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
      className="rounded-md border border-gray-500 group"
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      {selectedVariant?.medias[0].type === "image" ? (
        <Card.Image src={selectedVariant.medias[0].url} className="h-[300px]" />
      ) : (
        <Card.Image src="/Background.jpeg" className="h-[300px]" />
      )}
      <Card.Description asLink={false}>
        <h1>{name}</h1>
        <p>Price : {convertPrice(selectedVariant?.price ?? 0)}</p>
        <p>variant : {selectedVariant?.name_variant}</p>
      </Card.Description>
      {withAction ? (
        <Card.Footer>
          <div className="flex items-center gap-2">
            <ButtonQtyCart id={id} variant="dec" disabled={quantity === 1} />
            <span>{quantity}</span>
            <ButtonQtyCart id={id} variant="inc" />
          </div>
          <ButtonDeleteCart id={id} />
        </Card.Footer>
      ) : null}
      {withAction ? (
        <Card.Footer>
          <CheckboxCheckout id={id} isCheckout={isCheckout} />
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
