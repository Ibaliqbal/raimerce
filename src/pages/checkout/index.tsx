import { UserProvider } from "@/context/user-context";
import BaseLayout from "@/layouts/base-layout";
import CheckoutView from "@/views/checkout/checkout-view";

const Page = () => {
  return (
    <UserProvider>
      <BaseLayout>
        <CheckoutView />
      </BaseLayout>
    </UserProvider>
  );
};

export default Page;
