import AdminLayout from "@/layouts/admin-layout";
import AdminManageStoresView from "@/views/admin/manage-stores/admin-manage-stores-view";

const Page = () => {
  return (
    <AdminLayout title="Admin Manage Stores - Raimerce">
      <AdminManageStoresView />
    </AdminLayout>
  );
};

export default Page;
