import { Button } from "@/components/ui/button";
import FormPromo from "@/layouts/form/form-promo";
import instance from "@/lib/axios/instance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

const StoreCreatePromoView = () => {
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: ["products", "owner"],
    queryFn: async () => {
      // Simulate API call to create a new promo
      const res = (await instance.get("/users/login/store/products/allowed"))
        .data.data;
      return res;
    },
  });
  return (
    <section className="col-span-2 flex flex-col gap-4 pb-8">
      <Button
        className="flex items-center gap-3 w-fit"
        variant="icon"
        onClick={() => router.back()}
      >
        <FaArrowLeft />
        Back
      </Button>
      <h1 className="md:text-2xl text-xl self-center font-semibold">
        Craete discount for your products
      </h1>
      <FormPromo
        products={data}
        fetchLoad={isLoading}
        type="Create"
        withReset
        handleSubmit={async (data) => {
          try {
            const res = await instance.post("/users/login/store/promo", {
              ...data,
              amount: data.amount.toString(),
              expireAt: new Date(data.expireAt),
            });

            toast.success(res.data.message);
          } catch (error) {
            if (error instanceof AxiosError) {
              toast.error(error.response?.data.message);
            }
          }
        }}
        defaultValues={{
          code: "",
          allowedProducts: [],
          expireAt: undefined,
        }}
        amount={0}
      />
    </section>
  );
};

export default StoreCreatePromoView;
