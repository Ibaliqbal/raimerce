import AdminLayout from "@/layouts/admin-layout";
import AdminSettingsView from "@/views/admin/settings/admin-settings-view";
const Page = () => {
  return (
    <AdminLayout title="Admin Settings - Raimerce">
      <AdminSettingsView />
    </AdminLayout>
  );
};

export default Page;
