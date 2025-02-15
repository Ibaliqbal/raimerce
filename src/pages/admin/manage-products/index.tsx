import AdminLayout from "@/layouts/admin-layout";
import AdminManageProductsView from "@/views/admin/manage-products/admin-manage-product-view";

const Page = () => {
  return (
    <AdminLayout title="Admin Manage Products - Raimerce">
      <AdminManageProductsView />
    </AdminLayout>
  );
};

export default Page;
