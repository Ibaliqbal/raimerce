import { LoadingScreenProvider } from "@/context/loading-screen-context";
import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreOrdersView from "@/views/my/store/orders/store-orders-view";

const Page = () => {
  return (
    <LoadingScreenProvider>
      <StoreOwnerLayout>
        <StoreOrdersView />
      </StoreOwnerLayout>
    </LoadingScreenProvider>
  );
};

export default Page;
