import { Button } from "@/components/ui/button";
import { useLoadingScreen } from "@/context/loading-screen-context";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCart } from "react-icons/bs";
import { RiLoader5Line } from "react-icons/ri";

type Props = Pick<TProducts, "id" | "category"> & {
  quantity: number;
  selectedVariant: string;
};

const ButtonAddToCart = ({
  id,
  quantity,
  category,
  selectedVariant,
}: Props) => {
  const [status, setStatus] = useState(false);
  const { setOpen } = useLoadingScreen();
  return (
    <Button
      variant="outline"
      size="xl"
      className="flex items-center gap-3 text-xl"
      disabled={status}
      onClick={async () => {
        setStatus(true);
        try {
          const res = await instance.post("/carts", {
            productId: id,
            quantity,
            category,
            variant: selectedVariant,
          });
          setStatus(false);
          toast.success(res.data.message);
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.status === 403) {
              setOpen(true);
              setStatus(false);
              signIn();
              return;
            }
            console.log(error);
            toast.error(error.response?.data.message);
          }
          setStatus(false);
        }
      }}
    >
      {status ? <RiLoader5Line className="animate-spin" /> : <BsCart />}
      Add cart
    </Button>
  );
};

export default ButtonAddToCart;
