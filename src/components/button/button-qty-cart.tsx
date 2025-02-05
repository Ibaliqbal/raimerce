import { FaMinus, FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import { ComponentPropsWithoutRef } from "react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { TCart, TProducts } from "@/lib/db/schema";
import { toast } from "react-hot-toast";
import { RiLoader5Line } from "react-icons/ri";
import { ApiResponse } from "@/utils/api";

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
                    data: data.data.map((cart) =>
                      cart.id === id
                        ? {
                            ...cart,
                            quantity:
                              variant === "inc"
                                ? cart.quantity + 1
                                : cart.quantity - 1,
                          }
                        : cart
                    ),
                  };
                } else {
                  return data;
                }
              }) || [],
            pageParams: oldData?.pageParams || [],
          };
        }
      });

      return { previousCart };
    },
    onError: (
      err: Error,
      _: void,
      ctx?: {
        previousCart:
          | InfiniteData<
              ApiResponse & {
                data: Array<
                  Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
                    product: Pick<TProducts, "name" | "variant"> | null;
                  }
                >;
                totalPage: number;
              }
            >
          | undefined;
      }
    ) => {
      console.log(err);
      if (ctx) {
        queryClient.setQueryData(["cart"], ctx?.previousCart);
      }
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
