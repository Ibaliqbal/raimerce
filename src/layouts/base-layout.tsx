import NavbarBase from "@/components/navbar/navbar-base";
import Head from "@/components/ui/head";
import { useRouter } from "next/router";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
  description?: string;
  keyword?: string[];
} & ComponentPropsWithoutRef<"section">;

const BaseLayout = ({
  children,
  className,
  title,
  description,
  keyword,
  ...rest
}: Props) => {
  const { pathname, asPath } = useRouter();

  return (
    <section className={className} {...rest}>
      <Head
        title={title}
        site={asPath}
        description={description}
        keyword={keyword}
      />
      {[
        "/verification_payment",
        "/my/order/[id]",
        "/my/store/orders/[id]",
      ].includes(pathname) ? null : (
        <NavbarBase />
      )}
      {children}
    </section>
  );
};

export default BaseLayout;
