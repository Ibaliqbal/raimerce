import { cn } from "@/lib/utils";
import { navigationStore } from "@/utils/constant";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const TabNavigationStore: React.FC = () => {
  const router = useRouter();
  const name = router.query.name as string | undefined;

  return (
    <section className="grid grid-cols-2 gap-3">
      {navigationStore(name || "").map((navigate) => (
        <Link
          href={navigate.href}
          key={navigate.href}
          className={cn(
            "hover:bg-black dark:hover:bg-white dark:hover:bg-opacity-20 hover:bg-opacity-20 transition-all duration-300 ease-out py-4 text-center rounded-md",
            navigate.href === router.pathname.replace("[name]", name || "")
              ? "bg-black dark:bg-white dark:bg-opacity-20 bg-opacity-20"
              : ""
          )}
        >
          {navigate.name}
        </Link>
      ))}
    </section>
  );
};

export default TabNavigationStore;
