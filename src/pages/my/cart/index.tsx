import { LoadingScreenProvider } from "@/context/loading-screen-context";
import UserLayout from "@/layouts/user-layout";
import CartView from "@/views/my/cart/cart-view";

const Page = () => {
  return (
    <LoadingScreenProvider>
      <UserLayout>
        <CartView />
      </UserLayout>
    </LoadingScreenProvider>
  );
};

export default Page;
