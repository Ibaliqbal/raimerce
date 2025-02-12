import BaseLayout from "@/layouts/base-layout";
import ProductCommentsView from "@/views/products/detail/product-comments-view";
const Page = () => {
  return (
    <BaseLayout
      title="Komentar Produk - Raimerce"
      description="Baca komentar dan ulasan dari pengguna lain tentang produk ini di Raimerce. Temukan pendapat dan pengalaman mereka untuk membantu Anda membuat keputusan belanja yang lebih baik."
      keyword={[
        "komentar produk",
        "ulasan produk",
        "Raimerce",
        "pendapat pengguna",
        "belanja online",
        "pengalaman belanja",
      ]}
    >
      <ProductCommentsView />
    </BaseLayout>
  );
};

export default Page;
