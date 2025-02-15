import AdminLayout from "@/layouts/admin-layout";
import AdminDashboardView from "@/views/admin/dashboard/admin-dashboard-view";

const Page = () => {
  return (
    <AdminLayout title="Admin Dashboard - Raimerce">
      <AdminDashboardView />
    </AdminLayout>
  );
};

export default Page;
