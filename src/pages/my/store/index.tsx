import StoreOwnerLayout from "@/layouts/store-owner-layout";
import StoreDashboardView from "@/views/my/store/dashboard/store-dashboard-view";

const Page = () => {
  return (
    <StoreOwnerLayout title="Dashboard Store - Raimerce">
      <StoreDashboardView />
    </StoreOwnerLayout>
  );
};

export default Page;
