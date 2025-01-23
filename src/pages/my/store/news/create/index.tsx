import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreCreateNewsView from "@/views/my/store/news/store-create-news-view";

const Page = () => {
  return (
    <StoreOwnerLayout>
      <StoreCreateNewsView />
    </StoreOwnerLayout>
  );
};

export default Page;
