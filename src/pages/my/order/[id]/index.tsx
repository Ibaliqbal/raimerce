import { useRouter } from "next/router";
import OrderDetailView from "@/views/my/order/order-detail-view";
import BaseLayout from "@/layouts/base-layout";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { TOrder, TUser } from "@/lib/db/schema";
import Loader from "@/components/ui/loader";
const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useQuery<
    Pick<TOrder, "status" | "createdAt" | "products" | "transactionCode" | "promoCodes"> & {
      user: Pick<TUser, "email" | "name" | "phone"> | null;
    }
  >({
    queryKey: ["order", id as string],
    queryFn: async () => (await instance.get(`/orders/${id}`)).data.data,
    staleTime: 60 * 1000,
  });

  if (isLoading)
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Loader />
      </div>
    );

  return <BaseLayout className="pt-10">{data && <OrderDetailView order={data} />}</BaseLayout>;
};

export default Page;
