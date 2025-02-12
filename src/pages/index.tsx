import BaseLayout from "@/layouts/base-layout";
import HomeView from "@/views/home/home-view";

export default function Page() {
  return (
    <BaseLayout
      title="Raimerce - E-commerce Open Source Terbaik"
      description="Selamat datang di Raimerce, platform e-commerce open source kami. Temukan berbagai produk berkualitas dengan harga terbaik dan nikmati pengalaman belanja online yang mudah dan aman. Bergabunglah dengan komunitas kami dan mulai berbelanja sekarang!"
      keyword={[
        "raimerce",
        "ecommerce",
        "open source",
        "belanja online",
        "platform e-commerce",
        "produk berkualitas",
        "harga terbaik",
        "komunitas belanja",
      ]}
    >
      <HomeView />
    </BaseLayout>
  );
}
