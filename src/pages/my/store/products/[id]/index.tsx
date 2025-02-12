import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreProductsDetail from "@/views/my/store/products/store-products-detail-view";

const Page = () => {
  return (
    <StoreOwnerLayout title={`Detail Produk - Raimerce`}>
      <StoreProductsDetail />
    </StoreOwnerLayout>
  );
};

export default Page;
