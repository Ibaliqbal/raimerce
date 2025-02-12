import BaseLayout from "@/layouts/base-layout";
import ProductsView from "@/views/products/products-view";

const Page = () => {
  return (
    <BaseLayout
      title="Raimerce - Temukan Pilihan Anda"
      description="Jelajahi koleksi produk terbaik di Raimerce. Temukan berbagai pilihan produk berkualitas dari berbagai kategori, dengan harga yang bersaing. Belanja sekarang dan nikmati pengalaman berbelanja yang menyenangkan!"
      keyword={[
        "produk",
        "Raimerce",
        "belanja online",
        "produk berkualitas",
        "kategori produk",
        "harga bersaing",
        "koleksi produk",
      ]}
    >
      <ProductsView />
    </BaseLayout>
  );
};

export default Page;
