import { ReactNode } from "react";
import { StoreProvider } from "@/context/store-context";
import UserLayout from "./user-layout";

type Props = {
  children: ReactNode;
  title: string;
  description?: string;
  keyword?: string[];
};

const StoreOwnerLayout = ({ children, ...rest }: Props) => {
  return (
    <UserLayout {...rest}>
      <StoreProvider>{children}</StoreProvider>
    </UserLayout>
  );
};

export default StoreOwnerLayout;
