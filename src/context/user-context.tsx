import instance from "@/lib/axios/instance";
import { TStore, TUser } from "@/lib/db/schema";
import { TMedia } from "@/types/product";
import { ApiResponse } from "@/utils/api";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import * as React from "react";
import { toast } from "react-hot-toast";

type UserContextType = {
  user:
    | (Pick<
        TUser,
        "address" | "avatar" | "email" | "name" | "typeLogin" | "phone"
      > & {
        store: Pick<TStore, "id"> & {
          ordersCount: number;
          notificationsCount: number;
        };
        cartsCount: number;
        pendingOrdersCount: number;
        notificationsCount: number;
      })
    | null;
  loading: boolean;
  updateAvatar: UseMutationResult<
    AxiosResponse<ApiResponse, Error>,
    Error,
    TMedia,
    unknown
  >;
};

const UserContext = React.createContext<UserContextType | null>(null);

async function getLoginUser() {
  const data = (await instance.get("/users/login")).data.data;
  return data;
}

export const UserProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const queryClient = useQueryClient();
  const keyQuery = "login-user";
  const { isLoading, data } = useQuery({
    queryKey: [keyQuery],
    retry: false,
    queryFn: getLoginUser,
  });

  const updateAvatar = useMutation({
    mutationFn: async (media: TMedia) =>
      await instance.put("/users/login?_type=update_avatar", media),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [keyQuery],
      });
      toast.success(res.data.message);
    },
  });

  return (
    <UserContext.Provider
      value={{
        loading: isLoading,
        user: data,
        updateAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useGetUserLogin = () => {
  const res = React.useContext(UserContext);

  return res;
};
