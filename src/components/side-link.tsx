import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
} from "react";

type Props = {
  iconActive: ReactElement;
  iconNonActive: ReactElement;
  children: ReactNode;
} & ComponentPropsWithoutRef<"a">;

const SideLink = ({
  iconActive,
  iconNonActive,
  children,
  className,
  href,
  ...rest
}: Props) => {
  const router = useRouter();
  return (
    <Link
      href={href as string}
      className={cn(
        className,
        "flex gap-3 items-center p-2 py-3",
        router.pathname === href &&
          "bg-black bg-opacity-5 rounded-md dark:bg-white dark:bg-opacity-5"
      )}
      {...rest}
    >
      {router.pathname === href ? iconActive : iconNonActive}
      {children}
    </Link>
  );
};

export default SideLink;
