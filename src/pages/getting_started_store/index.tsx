import { UserProvider } from "@/context/user-context";
import BaseLayout from "@/layouts/base-layout";
import GettingStartedStoreView from "@/views/getting-started/getting-started-store-view";

const Page = () => {
  return (
    <BaseLayout>
      <UserProvider>
        <GettingStartedStoreView />
      </UserProvider>
    </BaseLayout>
  );
};

export default Page;
