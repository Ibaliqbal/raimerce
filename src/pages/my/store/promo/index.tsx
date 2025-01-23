import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StorePromoView from "@/views/my/store/promo/store-promo-view";
import React from "react";

const Page = () => {
  return (
    <StoreOwnerLayout>
      <StorePromoView />
    </StoreOwnerLayout>
  );
};

export default Page;
