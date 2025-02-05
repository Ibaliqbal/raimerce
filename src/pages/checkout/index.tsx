import { LoadingScreenProvider } from "@/context/loading-screen-context";
import { UserProvider } from "@/context/user-context";
import BaseLayout from "@/layouts/base-layout";
import CheckoutView from "@/views/checkout/checkout-view";

const Page = () => {
  return (
    <UserProvider>
      <LoadingScreenProvider>
        <BaseLayout>
          <CheckoutView />
        </BaseLayout>
      </LoadingScreenProvider>
    </UserProvider>
  );
};

export default Page;
