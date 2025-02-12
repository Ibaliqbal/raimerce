import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreOrdersView from "@/views/my/store/orders/store-orders-view";

const Page = () => {
  return (
    <StoreOwnerLayout title="Daftar Pesanan Store - Raimerce">
      <StoreOrdersView />
    </StoreOwnerLayout>
  );
};

export default Page;
