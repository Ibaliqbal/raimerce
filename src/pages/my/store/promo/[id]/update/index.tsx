import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreUpdatePromoView from "@/views/my/store/promo/store-update-promo-view";

const Page = () => {
  return (
    <StoreOwnerLayout title="Perbarui Promo - Raimerce">
      <StoreUpdatePromoView />
    </StoreOwnerLayout>
  );
};

export default Page;
