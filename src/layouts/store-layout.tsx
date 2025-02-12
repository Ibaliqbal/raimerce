import React, { ReactNode } from "react";
import BaseLayout from "./base-layout";
import ProfileStore from "@/components/store/profile-store";
import TabNavigationStore from "@/components/store/tab-navigation-store";
import { TStore } from "@/lib/db/schema";

type Props = {
  children: ReactNode;
  productsCount: number;
  followersCount: number;
  title: string;
  descriptionWeb?: string;
  keyword?: string[];
} & Pick<TStore, "address" | "name" | "headerPhoto" | "description" | "id">;

const StoreLayout = ({
  children,
  title,
  descriptionWeb,
  keyword,
  ...data
}: Props) => {
  return (
    <BaseLayout title={title} description={descriptionWeb} keyword={keyword}>
      <main className="wrapper-page flex flex-col gap-4">
        <ProfileStore {...data} />
        <TabNavigationStore />
        {children}
      </main>
    </BaseLayout>
  );
};

export default StoreLayout;
