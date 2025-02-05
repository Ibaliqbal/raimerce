import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreSettingsView from "@/views/my/store/settings/store-settings-view";

const Page = () => {
  return (
    <StoreOwnerLayout>
      <StoreSettingsView />
    </StoreOwnerLayout>
  );
};

export default Page;
