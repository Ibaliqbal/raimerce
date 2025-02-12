import UserLayout from "@/layouts/user-layout";
import NotificationsStoreView from "@/views/my/store/notifications/notifications-store-view";

const Page = () => {
  return (
    <UserLayout title="Notifikasi Store - Raimerce">
      <NotificationsStoreView />
    </UserLayout>
  );
};

export default Page;
