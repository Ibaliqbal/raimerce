import AdminLayout from "@/layouts/admin-layout";
import AdminNotificationsView from "@/views/admin/notifications/admin-notifications-view";

const Page = () => {
  return (
    <AdminLayout title="Admin Notifications - Raimerce">
      <AdminNotificationsView />
    </AdminLayout>
  );
};

export default Page;
