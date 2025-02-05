import { MdOutlineDashboard, MdDashboard } from "react-icons/md";
import {
  BsBagPlusFill,
  BsBagPlus,
  BsGearFill,
  BsGear,
  BsBag,
  BsBagFill,
} from "react-icons/bs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useRouter } from "next/router";
import { IoStorefront, IoStorefrontOutline } from "react-icons/io5";
import { RiCoupon3Line, RiCoupon3Fill } from "react-icons/ri";
import SideLink from "../side-link";

const SideListsStore = () => {
  const { pathname } = useRouter();
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="list-navigation-store">
        <AccordionTrigger className="p-2 py-3">
          <h3 className="flex gap-3 items-center text-xl">
            {pathname.includes("store") ? (
              <IoStorefront />
            ) : (
              <IoStorefrontOutline />
            )}{" "}
            Store
          </h3>
        </AccordionTrigger>
        <AccordionContent className="pl-3 flex flex-col gap-1">
          <SideLink
            href="/my/store"
            iconActive={<MdDashboard />}
            iconNonActive={<MdOutlineDashboard />}
            className="text-xl"
          >
            Dashboard
          </SideLink>
          <SideLink
            href="/my/store/products"
            iconActive={<BsBagPlusFill />}
            iconNonActive={<BsBagPlus />}
            className="text-xl"
          >
            Products
          </SideLink>
          <SideLink
            href="/my/store/promo"
            iconActive={<RiCoupon3Fill />}
            iconNonActive={<RiCoupon3Line />}
            className="text-xl"
          >
            Promo
          </SideLink>
          <SideLink
            href="/my/store/orders"
            iconActive={<BsBagFill />}
            iconNonActive={<BsBag />}
            className="text-xl"
          >
            Orders
          </SideLink>
          <SideLink
            href="/my/store/settings"
            iconActive={<BsGearFill />}
            iconNonActive={<BsGear />}
            className="text-xl"
          >
            Settings
          </SideLink>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SideListsStore;
