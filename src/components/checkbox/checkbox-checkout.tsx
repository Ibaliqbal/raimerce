import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TCart } from "@/lib/db/schema";
import instance from "@/lib/axios/instance";
import { RiLoader5Line } from "react-icons/ri";

type Props = {
  id: string;
  isCheckout: boolean;
};

const CheckboxCheckout = ({ id, isCheckout }: Props) => {
  const queryClient = useQueryClient();

  const { data: statusCheckout } = useQuery<Pick<TCart, "id" | "isCheckout">>({
    queryKey: ["status-checkout", id],
    queryFn: async () =>
      (await instance.get(`/carts/${id}/status_checkout`)).data.data,
    staleTime: Infinity,
    initialData: { id, isCheckout },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async () => await instance.put(`/carts/${id}/status_checkout`),
    async onMutate() {
      await queryClient.cancelQueries({ queryKey: ["status-checkout", id] });
      await queryClient.cancelQueries({
        queryKey: ["status-checkout-all-cart"],
      });

      const previousData = queryClient.getQueryData<
        Pick<TCart, "id" | "isCheckout">
      >(["status-checkout", id]);

      const previousTotalCheckout = queryClient.getQueryData<
        Array<Pick<TCart, "id" | "isCheckout">>
      >(["status-checkout-all-cart"]);

      queryClient.setQueryData(["status-checkout", id], () => ({
        id,
        isCheckout: !previousData?.isCheckout,
      }));
      queryClient.setQueryData<Array<Pick<TCart, "id" | "isCheckout">>>(
        ["status-checkout-all-cart"],
        (oldData) =>
          oldData?.map((cart) =>
            cart.id === id ? { ...cart, isCheckout: !cart.isCheckout } : cart
          )
      );

      return { previousData, previousTotalCheckout };
    },
    onError(error, _, context) {
      queryClient.setQueryData(["status-checkout", id], context?.previousData);

      queryClient.setQueryData<Array<Pick<TCart, "id" | "isCheckout">>>(
        ["status-checkout-all-cart"],
        context?.previousTotalCheckout
      );
      console.error(error);
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["status-checkout-all-cart"],
      });
      queryClient.invalidateQueries({
        queryKey: ["status-checkout", id],
      });
    },
  });

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`checkout-${id}`}
        checked={statusCheckout.isCheckout}
        onCheckedChange={() => mutate()}
        disabled={isPending}
      />
      {isPending ? (
        <RiLoader5Line className="animate-spin" />
      ) : (
        <Label
          htmlFor={`checkout-${id}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Checkout
        </Label>
      )}
    </div>
  );
};

export default CheckboxCheckout;
