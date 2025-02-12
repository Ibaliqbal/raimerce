import Loader from "@/components/ui/loader";
import BaseLayout from "@/layouts/base-layout";
import instance from "@/lib/axios/instance";
import { TOrder, TUser } from "@/lib/db/schema";
import StoreOrderDetailView from "@/views/my/store/orders/store-order-detail-view";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useQuery<
    Pick<
      TOrder,
      "status" | "createdAt" | "products" | "transactionCode" | "promoCodes"
    > & {
      user: Pick<TUser, "email" | "name" | "phone"> | null;
    }
  >({
    queryKey: ["order", id as string, "owner"],
    queryFn: async () =>
      (await instance.get(`/users/login/store/orders/${id}`)).data.data,
    staleTime: 60 * 1000,
  });

  if (isLoading)
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <BaseLayout
      className="py-10"
      title={`Detail Pesanan ${data?.transactionCode} - Raimerce`}
    >
      {data && <StoreOrderDetailView order={data} />}
    </BaseLayout>
  );
};

export default Page;
