import UserLayout from "@/layouts/user-layout";
import NotificationsView from "@/views/my/notifications/notifications-view";

const Page = () => {
  return (
    <UserLayout title="Notifikasi - Raimerce">
      <NotificationsView />
    </UserLayout>
  );
};

export default Page;
