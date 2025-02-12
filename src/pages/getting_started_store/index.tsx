import { UserProvider } from "@/context/user-context";
import BaseLayout from "@/layouts/base-layout";
import GettingStartedStoreView from "@/views/getting-started/getting-started-store-view";

const Page = () => {
  return (
    <BaseLayout
      title="Buat Toko Baru - Raimerce"
      description="Bergabunglah dengan Raimerce dan buat toko online Anda sendiri! Isi informasi yang diperlukan untuk memulai perjalanan e-commerce Anda dan jangkau pelanggan di seluruh dunia."
      keyword={[
        "buat toko",
        "Raimerce",
        "toko online",
        "e-commerce",
        "bergabung",
        "jual produk",
        "platform belanja",
      ]}
    >
      <UserProvider>
        <GettingStartedStoreView />
      </UserProvider>
    </BaseLayout>
  );
};

export default Page;
