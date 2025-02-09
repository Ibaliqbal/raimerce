import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreOrdersView from "@/views/my/store/orders/store-orders-view";

const Page = () => {
  return (
    <StoreOwnerLayout>
      <StoreOrdersView />
    </StoreOwnerLayout>
  );
};

export default Page;
