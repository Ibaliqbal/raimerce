import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreSettingsView from "@/views/my/store/settings/store-settings-view";
import React from "react";

const Page = () => {
  return (
    <StoreOwnerLayout>
      <StoreSettingsView />
    </StoreOwnerLayout>
  );
};

export default Page;
