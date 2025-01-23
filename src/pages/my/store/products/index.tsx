import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreProductsView from "@/views/my/store/products/store-products-view";

const Page = () => {
  return (
    <StoreOwnerLayout>
      <StoreProductsView />
    </StoreOwnerLayout>
  );
};

export default Page;
