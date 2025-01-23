import { ReactNode } from "react";
import { StoreProvider } from "@/context/store-context";
import UserLayout from "./user-layout";

type Props = {
  children: ReactNode;
};

const StoreOwnerLayout = ({ children }: Props) => {
  return (
    <UserLayout>
      <StoreProvider>{children}</StoreProvider>
    </UserLayout>
  );
};

export default StoreOwnerLayout;
