import UserLayout from "@/layouts/user-layout";
import CartView from "@/views/my/cart/cart-view";

const Page = () => {
  return (
    <UserLayout title="Keranjang Belanja - Raimerce">
      <CartView />
    </UserLayout>
  );
};

export default Page;
