import React, { ReactNode } from "react";
import BaseLayout from "./base-layout";
import ProfileStore from "@/components/store/profile-store";
import TabNavigationStore from "@/components/store/tab-navigation-store";
import { TStore } from "@/lib/db/schema";

type Props = {
  children: ReactNode;
  productsCount: number;
  followersCount: number;
} & Pick<TStore, "address" | "name" | "headerPhoto" | "description" | "id">;

const StoreLayout = ({ children, ...data }: Props) => {
  return (
    <BaseLayout>
      <main className="wrapper-page flex flex-col gap-4">
        <ProfileStore {...data} />
        <TabNavigationStore />
        {children}
      </main>
    </BaseLayout>
  );
};

export default StoreLayout;
