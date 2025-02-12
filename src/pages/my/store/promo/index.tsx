import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StorePromoView from "@/views/my/store/promo/store-promo-view";

const Page = () => {
  return (
    <StoreOwnerLayout title="List Promo - Raimerce">
      <StorePromoView />
    </StoreOwnerLayout>
  );
};

export default Page;
