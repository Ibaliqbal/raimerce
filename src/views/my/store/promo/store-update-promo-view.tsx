import Loader from "@/components/ui/loader";
import FormPromo from "@/layouts/form/form-promo";
import instance from "@/lib/axios/instance";
import { TPromo } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "sonner";

const StoreUpdatePromoView = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: products, isLoading: fetchLoad } = useQuery({
    queryKey: ["products", "owner"],
    queryFn: async () => {
      // Simulate API call to create a new promo
      const res = (await instance.get("/users/login/store/products")).data.data;
      return res;
    },
  });
  const { isLoading, data } = useQuery<
    Pick<TPromo, "code" | "expiredAt" | "amount" | "productsAllowed" | "id">
  >({
    queryKey: ["promo", id],
    queryFn: async () =>
      (await instance.get(`/users/login/store/promo/${id}`)).data.data,
  });

  if (isLoading) return <Loader className="col-span-2" />;

  return (
    <section className="col-span-2 flex flex-col gap-4">
      <h1 className="text-xl self-center">Update discount for your products</h1>
      <FormPromo
        products={products}
        fetchLoad={fetchLoad}
        type="Update"
        withReset={false}
        handleSubmit={async (dataForm) => {
          try {
            const res = await instance.put(
              `/users/login/store/promo/${data?.id}`,
              {
                ...dataForm,
                amount: dataForm.amount.toString(),
                expireAt: new Date(dataForm.expireAt),
              }
            );

            toast.success(res.data.message);
          } catch (error) {
            if (error instanceof AxiosError) {
              toast.error(error.response?.data.message);
            }
          }
        }}
        defaultValues={{
          code: data?.code as string,
          allowedProducts: data?.productsAllowed as string[],
          expireAt: new Date(data?.expiredAt as string),
        }}
        amount={data?.amount as number}
      />
    </section>
  );
};

export default StoreUpdatePromoView;
