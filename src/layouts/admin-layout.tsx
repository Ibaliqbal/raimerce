import { ComponentPropsWithoutRef } from "react";
import BaseLayout from "./base-layout";
import { cn } from "@/lib/utils";
import SidebarAdmin from "./siderbar/sidebar-admin";

type Props = {
  children: React.ReactNode;
  title: string;
} & ComponentPropsWithoutRef<"main">;

const AdminLayout = ({ children, className, title, ...rest }: Props) => {
  return (
    <BaseLayout title={title}>
      <main
        className={cn(
          "container max-w-[1350px] lg:grid lg:grid-cols-3 gap-4 relative flex flex-col my-8",
          className
        )}
        {...rest}
      >
        <SidebarAdmin inMobile={false} />
        {children}
      </main>
    </BaseLayout>
  );
};

export default AdminLayout;
