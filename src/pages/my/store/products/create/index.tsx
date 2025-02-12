import BaseLayout from "@/layouts/base-layout";
import StoreCreateProductView from "@/views/my/store/products/store-create-product-view";

const Products = () => {
  return (
    <BaseLayout title="Buat dan Kelola Produk Anda - Raimerce">
      <StoreCreateProductView />
    </BaseLayout>
  );
};

export default Products;
