import instance from "@/lib/axios/instance";
import { TNews, TStore, TUser } from "@/lib/db/schema";
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

type StoreContextType = {
  store:
    | (TStore & {
        owner: Pick<TUser, "id" | "name" | "email"> | null;
        news: Array<Pick<TNews, "content" | "createdAt" | "id" | "medias">>;
      })
    | null;
  loading: boolean;
  handleDeleteNews: UseMutationResult<
    AxiosResponse<ApiResponse, Error>,
    Error,
    string,
    unknown
  >;
  handleUpdateHeader: UseMutationResult<
    AxiosResponse<ApiResponse, Error>,
    Error,
    TMedia,
    unknown
  >;
  handleUpdatePopup: UseMutationResult<
    AxiosResponse<void, Error>,
    Error,
    void,
    unknown
  >;
};

const StoreContext = React.createContext<StoreContextType | null>(null);

async function getStoreData() {
  const data = (await instance.get(`/users/login/store`)).data.data;
  return data;
}

const keyQuery = "store-details-owner";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, data } = useQuery({
    queryKey: [keyQuery],
    retry: true,
    queryFn: getStoreData,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) =>
      await instance.delete(`/users/login/store/news/${id}`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [keyQuery],
      });
      toast.success(res.data.message);
    },
  });

  const handleUpdatePopup = useMutation({
    mutationFn: async () =>
      await instance.put(`/users/login/store?_type=popup`, {
        popupWhatsapp: !data.popupWhatsapp,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [keyQuery],
      });
      toast.success(res.data.message);
    },
  });

  const handleUpdateHeaderPhoto = useMutation({
    mutationFn: async (data: TMedia) =>
      await instance.put("/users/login/store?_type=update_header", data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [keyQuery],
      });
      toast.success(res.data.message);
    },
  });

  return (
    <StoreContext.Provider
      value={{
        loading: isLoading,
        store: data,
        handleDeleteNews: mutation,
        handleUpdateHeader: handleUpdateHeaderPhoto,
        handleUpdatePopup,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useGetStoreOwner = () => {
  const res = React.useContext(StoreContext);

  return res;
};
