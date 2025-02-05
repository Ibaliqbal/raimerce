import { LoadingScreenProvider } from "@/context/loading-screen-context";
import UserLayout from "@/layouts/user-layout";
import NotificationsView from "@/views/my/notifications/notifications-view";

const Page = () => {
  return (
    <LoadingScreenProvider>
      <UserLayout>
        <NotificationsView />
      </UserLayout>
    </LoadingScreenProvider>
  );
};

export default Page;
