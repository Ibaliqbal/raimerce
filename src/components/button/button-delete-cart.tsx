import instance from "@/lib/axios/instance";
import { TCart, TProducts } from "@/lib/db/schema";
import { ApiResponse } from "@/utils/api";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { BiTrash } from "react-icons/bi";
import { RiLoader5Line } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";

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
        InfiniteData<
          ApiResponse & {
            data: Array<
              Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
                product: Pick<TProducts, "name" | "variant"> | null;
              }
            >;
            totalPage: number;
          },
          number | undefined
        >
      >(["cart"]);

      queryClient.setQueryData<Array<Pick<TCart, "id" | "isCheckout">>>(
        ["status-checkout-all-cart"],
        (oldData) => oldData?.filter((cart) => cart.id !== id)
      );

      queryClient.setQueryData<
        InfiniteData<
          ApiResponse & {
            data: Array<
              Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
                product: Pick<TProducts, "name" | "variant"> | null;
              }
            >;
            totalPage: number;
          },
          unknown
        >
      >(["cart"], (oldData) => {
        const findIndexPage = oldData?.pages.findIndex((data) =>
          data.data.some((cart) => cart.id === id)
        );
        if (findIndexPage !== -1) {
          return {
            pages:
              oldData?.pages.map((data, i) => {
                if (findIndexPage === i) {
                  return {
                    ...data,
                    data: data.data.filter((cart) => cart.id !== id),
                  };
                } else {
                  return data;
                }
              }) || [],
            pageParams: oldData?.pageParams || [],
          };
        }
      });

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
      queryClient.invalidateQueries({
        queryKey: ["login-user"],
      });
    },
  });

  return (
    <Button
      size="icon"
      variant="icon"
      onClick={() => mutate()}
      disabled={isPending}
    >
      {isPending ? (
        <RiLoader5Line className="text-xl animate-spin" />
      ) : (
        <BiTrash className="text-xl cursor-pointer text-red-600" />
      )}
    </Button>
  );
};

export default ButtonDeleteCart;
