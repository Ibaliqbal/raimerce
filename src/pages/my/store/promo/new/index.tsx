import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreCreatePromoView from "@/views/my/store/promo/store-create-promo-view";

const Page = () => {
  return (
    <StoreOwnerLayout>
      <StoreCreatePromoView />
    </StoreOwnerLayout>
  );
};

export default Page;
