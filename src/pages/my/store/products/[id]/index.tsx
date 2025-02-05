import { LoadingScreenProvider } from "@/context/loading-screen-context";
import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreProductsDetail from "@/views/my/store/products/store-products-detail-view";

const Page = () => {
  return (
    <LoadingScreenProvider>
      <StoreOwnerLayout>
        <StoreProductsDetail />
      </StoreOwnerLayout>
    </LoadingScreenProvider>
  );
};

export default Page;
