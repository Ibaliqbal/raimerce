import {
  BsGear,
  BsGearFill,
  BsBag,
  BsBagFill,
  BsCart,
  BsCartFill,
  BsBell,
  BsBellFill,
} from "react-icons/bs";
import SideLink from "@/components/side-link";
import SideListsStore from "@/components/store/side-lists";
import { useGetUserLogin } from "@/context/user-context";
import { Skeleton } from "@/components/ui/skeleton";

const SidebarUser = () => {
  const data = useGetUserLogin();

  if (data?.loading)
    return (
      <aside className="col-span-1 hidden lg:flex flex-col gap-3 p-3 text-xl h-fit sticky top-3 border border-gray-500 rounded-md first:rounded-t-md">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </aside>
    );

  return (
    <aside className="col-span-1 hidden lg:flex flex-col gap-3 p-3 text-xl h-fit sticky top-3 border border-gray-500 rounded-md first:rounded-t-md">
      <SideLink
        href="/settings"
        iconActive={<BsGearFill />}
        iconNonActive={<BsGear />}
      >
        Settings
      </SideLink>
      <SideLink
        href="/my/order"
        iconActive={<BsBagFill />}
        iconNonActive={<BsBag />}
      >
        <p className="relative">
          Order
          {(data?.user?.pendingOrdersCount ?? 0) > 0 && (
            <span className="bg-red-500 text-xs w-6 h-6 rounded-full flex items-center justify-center absolute -right-5 -top-1 text-white">
              {data?.user?.pendingOrdersCount}
            </span>
          )}
        </p>
      </SideLink>
      <SideLink
        href="/my/cart"
        iconActive={<BsCartFill />}
        iconNonActive={<BsCart />}
      >
        <p className="relative">
          Cart
          {(data?.user?.cartsCount ?? 0) > 0 && (
            <span className="bg-red-500 text-xs w-6 h-6 rounded-full flex items-center justify-center absolute -right-5 -top-1 text-white">
              {data?.user?.cartsCount}
            </span>
          )}
        </p>
      </SideLink>
      <SideLink
        href="/my/notifications"
        iconActive={<BsBellFill />}
        iconNonActive={<BsBell />}
      >
        <p className="relative">
          Notifications
          {(data?.user?.notificationsCount ?? 0) > 0 && (
            <span className="bg-red-500 text-xs w-6 h-6 rounded-full flex items-center justify-center absolute -right-5 -top-1 text-white">
              {data?.user?.notificationsCount}
            </span>
          )}
        </p>
      </SideLink>
      {data?.user?.store?.id ? <SideListsStore {...data.user.store} /> : null}
    </aside>
  );
};

export default SidebarUser;
