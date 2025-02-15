import AdminLayout from "@/layouts/admin-layout";
import AdminManageUsersView from "@/views/admin/manage-users/admin-manage-users-view";

const Page = () => {
  return (
    <AdminLayout title="Admin Manage Users - Raimerce">
      <AdminManageUsersView />
    </AdminLayout>
  );
};

export default Page;
