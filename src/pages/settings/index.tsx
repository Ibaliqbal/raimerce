import SettingsProfileUserView from "@/views/settings/settings-profile-user-view";
import UserLayout from "@/layouts/user-layout";

const Page = () => {
  return (
    <UserLayout title="Setting profile - Raimerce">
      <SettingsProfileUserView />
    </UserLayout>
  );
};

export default Page;
