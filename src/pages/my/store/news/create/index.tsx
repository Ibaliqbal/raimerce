import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreCreateNewsView from "@/views/my/store/news/store-create-news-view";

const Page = () => {
  return (
    <StoreOwnerLayout title="Buat Berita Baru - Raimerce">
      <StoreCreateNewsView />
    </StoreOwnerLayout>
  );
};

export default Page;
