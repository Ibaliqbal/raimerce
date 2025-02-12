import { ComponentPropsWithoutRef } from "react";
import BaseLayout from "./base-layout";
import SidebarUser from "./siderbar/sidebar-user";
import { cn } from "@/lib/utils";
import { UserProvider } from "@/context/user-context";
import SidebarMobile from "./siderbar/sidebar-mobile";

type Props = {
  children: React.ReactNode;
} & ComponentPropsWithoutRef<"main">;

const UserLayout = ({ children, className, ...rest }: Props) => {
  return (
    <BaseLayout>
      <UserProvider>
        <main
          className={cn(
            "container max-w-[1350px] lg:grid lg:grid-cols-3 gap-4 relative flex flex-col",
            className
          )}
          {...rest}
        >
          <SidebarUser inMobile={false} />
          <SidebarMobile />
          {children}
        </main>
      </UserProvider>
    </BaseLayout>
  );
};

export default UserLayout;
