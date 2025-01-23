import React, { FormEvent, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import CardAddress from "@/components/card/card-address";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import Loader from "@/components/ui/loader";
import { VariantSchemaT } from "@/types/product";
import { TCart, TProducts } from "@/lib/db/schema";
import {
  calculateOrderSubtotal,
  calculateProductTotal,
  convertPrice,
  groupDiscountsByCode,
} from "@/utils/helper";
import { banks, fee } from "@/utils/constant";
import { MdClose } from "react-icons/md";
import { RiLoader5Line } from "react-icons/ri";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { DiscountSchemaT } from "@/types/promo";
import { useRouter } from "next/router";
import { useLoadingScreen } from "@/context/loading-screen-context";

const CheckoutView = () => {
  const { push } = useRouter();
  const { open, setOpen } = useLoadingScreen();
  const [status, setStatus] = useState<{
    type: "promo" | "checkout";
    status: "success" | "submitting" | "error";
  }>({
    type: "checkout",
    status: "success",
  });
  const { isLoading, data } = useQuery<
    Array<
      Pick<TCart, "variant" | "quantity" | "id" | "category"> & {
        product: Pick<TProducts, "name" | "id"> & {
          variant: VariantSchemaT | undefined;
        };
        subTotal: number;
        storeID: string;
      }
    >
  >({
    queryKey: ["checkout"],
    queryFn: async () => (await instance.get("/carts/checkout")).data.data,
  });

  const [discount, setDiscount] = useState<Array<DiscountSchemaT>>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  const handleApply = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const code = form.coupon.value;

    setStatus({
      type: "promo",
      status: "submitting",
    });

    try {
      const res = (await instance.get(`/promos/${code}`)).data.data;

      const findDisc = discount.find((disc) =>
        res.productsAllowed.includes(disc.appliedTo)
      );

      if (findDisc) {
        return toast.error("Coupon already applied");
      }

      const filteredCoupon = res.productsAllowed
        .filter((product: string) =>
          data?.some((cart) => cart.product.id === product)
        )
        .filter(
          (product: string) =>
            !discount.some((cart) => cart.appliedTo === product)
        );

      if (filteredCoupon.length < 0) {
        return toast.error(
          "Coupon is not applicable to any of your selected products"
        );
      }

      setDiscount((prev) => [
        ...prev,
        ...filteredCoupon.map((product: string) => ({
          code: res.code,
          amount: res.amount,
          appliedTo: product,
        })),
      ]);

      setStatus({
        type: "promo",
        status: "success",
      });

      form.reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        setStatus({
          type: "promo",
          status: "error",
        });
      }
    }
  };

  const handleCheckout = async () => {
    setStatus({
      type: "checkout",
      status: "submitting",
    });
    try {
      const res = await instance.post("/checkout", {
        productsID: data?.map((cart) => cart.id),
        paymentMethod: selectedPayment,
        discounts: discount,
        storeIDs: Array.from(new Set(data?.map((cart) => cart.storeID))),
      });

      toast.success(res.data.message);

      push(`/verification_payment?orderId=${res.data.data.orderID}`);

      setStatus({
        type: "checkout",
        status: "success",
      });
      setOpen(true);

      setDiscount([]);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        setStatus({
          type: "checkout",
          status: "error",
        });
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <main className="flex flex-col gap-8 wrapper-page max-w-4xl mx-auto py-8">
      <section className="p-4">
        <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
        <CardAddress />
      </section>

      <section className="p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        {data?.map((product) => (
          <div key={product.id} className="flex items-center mb-4">
            <Image
              src={product.product.variant?.medias[0].url as string}
              alt={product.product.name}
              width={200}
              height={200}
              className="rounded-md mr-4 w-[200px] h-[200px] object-cover object-center"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">{product.product.name}</h3>
              <p className="text-sm text-gray-600">
                Variant: {product.variant}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {product.quantity}
              </p>
            </div>
            <div className="flex items-center">
              {discount.find(
                (disc) => disc.appliedTo === product.product.id
              ) ? (
                <div className="flex items-center gap-1">
                  <p className="font-semibold">
                    {convertPrice(calculateProductTotal(product, discount))}
                  </p>
                  <p className="mb-3 text-base text-red-600 line-through">
                    {convertPrice(product.subTotal)}
                  </p>
                </div>
              ) : (
                <p className="font-semibold">
                  {convertPrice(product.subTotal)}
                </p>
              )}
            </div>
          </div>
        ))}
        <Separator className="my-4" />
        <div className="flex justify-between items-center">
          <p>Subtotal</p>
          <p className="font-semibold">
            {convertPrice(calculateOrderSubtotal(data ?? [], discount))}
          </p>
        </div>
      </section>

      <section className="p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
        <RadioGroup
          defaultValue={selectedPayment}
          onValueChange={(value) => setSelectedPayment(value)}
        >
          {banks.map((bank) => (
            <div key={bank} className="flex items-center space-x-2">
              <RadioGroupItem value={bank} id={bank} />
              <Label htmlFor={bank}>{bank}</Label>
            </div>
          ))}
        </RadioGroup>
      </section>

      <section className="p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Coupon</h2>
        <form className="flex gap-2" onSubmit={handleApply}>
          <Input
            placeholder="Enter coupon code"
            className="py-5"
            name="coupon"
            disabled={discount.length === data?.length}
          />
          <Button
            size="lg"
            variant="primary"
            type="submit"
            disabled={discount.length === data?.length}
          >
            {status.status === "submitting" && status.type === "promo" ? (
              <RiLoader5Line className="animate-spin text-lg" />
            ) : (
              "Apply"
            )}
          </Button>
        </form>
        {discount.length > 0 ? (
          <div className="mt-4 flex flex-col gap-4">
            {groupDiscountsByCode(discount).map((disc) => (
              <div
                className="flex items-center gap-2 p-3 bg-primary/10 rounded-md"
                key={disc.code}
              >
                <p className="flex-grow font-medium">
                  Coupon applied: {disc.code} ({disc.appliedTo.length} items)
                </p>
                <p className="font-semibold">{disc.amount}%</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:text-primary/80"
                  type="button"
                  onClick={() => {
                    setDiscount((prev) =>
                      prev.filter((d) => d.code !== disc.code)
                    );
                  }}
                >
                  <MdClose className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Order Total</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{convertPrice(calculateOrderSubtotal(data ?? [], discount))}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>{convertPrice(fee)}</p>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>
              {convertPrice(calculateOrderSubtotal(data ?? [], discount) + fee)}
            </p>
          </div>
        </div>
      </section>

      <Button
        className="w-full"
        variant="checkout"
        size="xl"
        onClick={handleCheckout}
        disabled={
          (status.status === "submitting" && status.type === "checkout") || open
        }
      >
        {(status.status === "submitting" && status.type === "checkout") ||
        open ? (
          <RiLoader5Line className="animate-spin text-lg" />
        ) : (
          "Place Order"
        )}
      </Button>
    </main>
  );
};

export default CheckoutView;
