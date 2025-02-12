import UserLayout from "@/layouts/user-layout";
import OrderView from "@/views/my/order/order-view";

const Page = () => {
  return (
    <UserLayout title="Daftar Pesanan - Raimerce">
      <OrderView />
    </UserLayout>
  );
};

export default Page;
