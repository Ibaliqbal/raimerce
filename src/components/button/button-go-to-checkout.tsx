import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { TCart } from "@/lib/db/schema";
import { useLoadingScreen } from "@/context/loading-screen-context";

const ButtonGoToCheckout = () => {
  const router = useRouter();
  const { data } = useQuery<Array<Pick<TCart, "id" | "isCheckout">>>({
    queryKey: ["status-checkout-all-cart"],
    queryFn: async () =>
      (await instance.get("/carts/status_checkout")).data.data,
    retry: false,
    staleTime: Infinity,
  });
  const { open, setOpen } = useLoadingScreen();

  return (
    <>
      <Button
        className="self-end"
        variant="checkout"
        onClick={() => {
          router.push("/checkout");
          setOpen(true);
        }}
        disabled={
          (data ?? []).filter((cart) => cart.isCheckout === true).length <= 0 ||
          open
        }
      >
        Go to checkout (
        {data?.filter((cart) => cart.isCheckout === true).length ?? 0})
      </Button>
    </>
  );
};

export default ButtonGoToCheckout;
