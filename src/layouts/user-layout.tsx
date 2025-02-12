import { ComponentPropsWithoutRef } from "react";
import BaseLayout from "./base-layout";
import SidebarUser from "./siderbar/sidebar-user";
import { cn } from "@/lib/utils";
import { UserProvider } from "@/context/user-context";
import SidebarMobile from "./siderbar/sidebar-mobile";

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
  keyword?: string[];
} & ComponentPropsWithoutRef<"main">;

const UserLayout = ({
  children,
  className,
  title,
  description,
  keyword,
  ...rest
}: Props) => {
  return (
    <BaseLayout title={title} description={description} keyword={keyword}>
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
