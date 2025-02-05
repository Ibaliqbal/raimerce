import NavbarBase from "@/components/navbar/navbar-base";
import { useRouter } from "next/router";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = { children: ReactNode } & ComponentPropsWithoutRef<"section">;

const BaseLayout = ({ children, className, ...rest }: Props) => {
  const { pathname } = useRouter();

  return (
    <section className={className} {...rest}>
      {pathname === "/verification_payment" ||
      pathname === "/my/order/[id]" ||
      pathname === "/my/store/orders/[id]" ? null : (
        <NavbarBase />
      )}
      {children}
    </section>
  );
};

export default BaseLayout;
