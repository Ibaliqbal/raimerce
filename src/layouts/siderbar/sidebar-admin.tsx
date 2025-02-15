import SideLink from "@/components/side-link";
import {
  BsBag,
  BsBagFill,
  BsGear,
  BsGearFill,
  BsMailbox2,
  BsMailbox2Flag,
} from "react-icons/bs";
import { HiOutlineUsers, HiUsers } from "react-icons/hi";
import { IoStorefront, IoStorefrontOutline } from "react-icons/io5";
import { MdDashboard, MdOutlineDashboard } from "react-icons/md";

type Props = {
  inMobile: boolean;
};

const SidebarAdmin = ({ inMobile }: Props) => {
  return (
    <aside
      className={`lg:col-span-1 ${
        inMobile ? "flex" : "hidden lg:flex"
      } flex-col gap-3 p-3 text-xl h-fit sticky top-3 lg:border lg:border-gray-500 rounded-md first:rounded-t-md`}
    >
      <SideLink
        href="/admin"
        iconActive={<MdDashboard />}
        iconNonActive={<MdOutlineDashboard />}
        className="text-xl"
      >
        Dashboard
      </SideLink>
      <SideLink
        href="/admin/manage-users"
        iconActive={<HiUsers />}
        iconNonActive={<HiOutlineUsers />}
        className="text-xl"
      >
        Users Management
      </SideLink>
      <SideLink
        href="/admin/manage-products"
        iconActive={<BsBagFill />}
        iconNonActive={<BsBag />}
        className="text-xl"
      >
        Products Management
      </SideLink>
      <SideLink
        href="/admin/manage-stores"
        iconActive={<IoStorefront />}
        iconNonActive={<IoStorefrontOutline />}
        className="text-xl"
      >
        Stores Management
      </SideLink>
      <SideLink
        href="/admin/notifications"
        iconActive={<BsMailbox2Flag />}
        iconNonActive={<BsMailbox2 />}
        className="text-xl"
      >
        Notifications
      </SideLink>
      <SideLink
        href="/admin/settings"
        iconActive={<BsGearFill />}
        iconNonActive={<BsGear />}
      >
        Settings
      </SideLink>
    </aside>
  );
};

export default SidebarAdmin;
