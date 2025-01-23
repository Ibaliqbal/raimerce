import instance from "@/lib/axios/instance";
import { TCart, TProducts } from "@/lib/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { RiLoader5Line } from "react-icons/ri";
import { toast } from "sonner";

const ButtonDeleteCart = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => await instance.delete(`/carts/${id}`),
    onSuccess: async () => {
      await queryClient.cancelQueries({
        queryKey: ["status-checkout-all-cart"],
      });

      await queryClient.cancelQueries({
        queryKey: ["cart"],
      });

      const previousData = queryClient.getQueryData<
        Array<Pick<TCart, "id" | "isCheckout">>
      >(["status-checkout-all-cart"]);

      const previousCart = queryClient.getQueryData<
        Array<
          Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
            product: Pick<TProducts, "name" | "variant"> | null;
          }
        >
      >(["cart"]);

      queryClient.setQueryData<Array<Pick<TCart, "id" | "isCheckout">>>(
        ["status-checkout-all-cart"],
        (oldData) => oldData?.filter((cart) => cart.id !== id)
      );

      queryClient.setQueryData<
        Array<
          Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
            product: Pick<TProducts, "name" | "variant"> | null;
          }
        >
      >(["cart"], (oldData) => oldData?.filter((cart) => cart.id !== id));

      toast.success("Success to delete product from cart");

      return { previousData, previousCart };
    },
    onError: (err) => {
      toast.error("Failed to delete product from cart");
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["status-checkout-all-cart"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  return isPending ? (
    <RiLoader5Line className="text-xl animate-spin" />
  ) : (
    <FaTrash
      className="text-xl cursor-pointer text-red-600"
      onClick={() => mutate()}
    />
  );
};

export default ButtonDeleteCart;
