import { FaMinus, FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import { ComponentPropsWithoutRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { TCart, TProducts } from "@/lib/db/schema";
import { toast } from "sonner";
import { RiLoader5Line } from "react-icons/ri";

type Props = {
  variant: "inc" | "dec";
  id: string;
} & ComponentPropsWithoutRef<"button">;

const ButtonQtyCart = ({ variant, id, disabled, ...rest }: Props) => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async () => await instance.put(`/carts/${id}?_type=${variant}`),
    onSuccess: async () => {
      await queryClient.cancelQueries({
        queryKey: ["cart"],
      });

      queryClient.setQueryData<
        Array<
          Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
            product: Pick<TProducts, "name" | "variant"> | null;
          }
        >
      >(["cart"], (oldData) =>
        oldData?.map((cart) =>
          cart.id === id
            ? {
                ...cart,
                quantity:
                  variant === "inc" ? cart.quantity + 1 : cart.quantity - 1,
              }
            : cart
        )
      );

      const previousCart = queryClient.getQueryData<
        Array<
          Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
            product: Pick<TProducts, "name" | "variant"> | null;
          }
        >
      >(["cart"]);

      return { previousCart };
    },
    onError: (err) => {
      console.log(err);
      toast.error("Failed update data");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  return (
    <Button
      size="sm"
      variant="icon"
      {...rest}
      disabled={isPending || disabled}
      onClick={() => mutate()}
    >
      {isPending ? (
        <RiLoader5Line className="animate-spin text-lg" />
      ) : variant === "inc" ? (
        <FaPlus />
      ) : (
        <FaMinus />
      )}
    </Button>
  );
};

export default ButtonQtyCart;
