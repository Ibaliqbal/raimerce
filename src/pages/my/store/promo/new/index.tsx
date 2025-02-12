import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreCreatePromoView from "@/views/my/store/promo/store-create-promo-view";

const Page = () => {
  return (
    <StoreOwnerLayout title="Buat Promo Baru - Raimerce">
      <StoreCreatePromoView />
    </StoreOwnerLayout>
  );
};

export default Page;
