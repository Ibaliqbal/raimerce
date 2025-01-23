import {
  BsGear,
  BsGearFill,
  BsBag,
  BsBagFill,
  BsCart,
  BsCartFill,
} from "react-icons/bs";

import SideLink from "@/components/side-link";
import SideListsStore from "@/components/store/side-lists";
import { useGetUserLogin } from "@/context/user-context";
import { Skeleton } from "@/components/ui/skeleton";

const SidebarUser = () => {
  const data = useGetUserLogin();

  if (data?.loading)
    return (
      <aside className="col-span-1 flex flex-col gap-3 p-3 text-xl h-fit sticky top-3 border border-gray-500 rounded-md first:rounded-t-md">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </aside>
    );

  return (
    <aside className="col-span-1 flex flex-col gap-3 p-3 text-xl h-fit sticky top-3 border border-gray-500 rounded-md first:rounded-t-md">
      <SideLink
        href="/settings"
        iconActive={<BsGearFill />}
        iconNonActive={<BsGear />}
        text="Settings"
      />
      <SideLink
        href="/my/order"
        iconActive={<BsBagFill />}
        iconNonActive={<BsBag />}
        text="Order"
      />
      <SideLink
        href="/my/cart"
        iconActive={<BsCartFill />}
        iconNonActive={<BsCart />}
        text="Cart"
      />
      {data?.user?.store?.id ? <SideListsStore /> : null}
    </aside>
  );
};

export default SidebarUser;
