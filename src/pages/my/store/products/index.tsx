import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreProductsView from "@/views/my/store/products/store-products-view";

const Page = () => {
  return (
    <StoreOwnerLayout title="Produk Store - Raimerce">
      <StoreProductsView />
    </StoreOwnerLayout>
  );
};

export default Page;
