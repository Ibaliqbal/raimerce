import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreNewsView from "@/views/my/store/news/store-news-view";

const Page = () => {
  return (
    <StoreOwnerLayout>
      <StoreNewsView />
    </StoreOwnerLayout>
  );
};

export default Page;
