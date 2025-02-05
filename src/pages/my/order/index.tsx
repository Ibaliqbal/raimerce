import { LoadingScreenProvider } from "@/context/loading-screen-context";
import UserLayout from "@/layouts/user-layout";
import OrderView from "@/views/my/order/order-view";

const Page = () => {
  return (
    <LoadingScreenProvider>
      <UserLayout>
        <OrderView />
      </UserLayout>
    </LoadingScreenProvider>
  );
};

export default Page;
