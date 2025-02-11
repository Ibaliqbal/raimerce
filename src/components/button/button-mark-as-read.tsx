import instance from "@/lib/axios/instance";
import { TNotification } from "@/lib/db/schema";
import { ApiResponse } from "@/utils/api";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  id: string;
};

const ButtonMarkA = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      await instance.put(`/notifications/${id}`);
    },
    onSuccess: async () => {
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      const previousNotif = queryClient.getQueryData<
        InfiniteData<
          ApiResponse & {
            data: Array<
              Pick<TNotification, "id" | "content" | "createdAt" | "isRead">
            >;
            totalPage: number;
          },
          number | undefined
        >
      >(["notifications"]);

      queryClient.setQueryData<
        InfiniteData<
          ApiResponse & {
            data: Array<
              Pick<TNotification, "id" | "content" | "createdAt" | "isRead">
            >;
            totalPage: number;
          },
          unknown
        >
      >(["cart"], (oldData) => {
        const findIndexPage = oldData?.pages.findIndex((data) =>
          data.data.some((notif) => notif.id === id)
        );
        if (findIndexPage !== -1) {
          return {
            pages:
              oldData?.pages.map((data, i) => {
                if (findIndexPage === i) {
                  return {
                    ...data,
                    data: data.data.map((notif) =>
                      notif.id === id
                        ? {
                            ...notif,
                            isRead: true,
                          }
                        : notif
                    ),
                  };
                } else {
                  return data;
                }
              }) || [],
            pageParams: oldData?.pageParams || [],
          };
        }
      });

      return { previousNotif };
    },
    onError: (
      err: Error,
      _: void,
      ctx?: {
        previousNotif:
          | InfiniteData<
              ApiResponse & {
                data: Array<
                  Pick<TNotification, "id" | "content" | "createdAt" | "isRead">
                >;
                totalPage: number;
              }
            >
          | undefined;
      }
    ) => {
      console.log(err);
      if (ctx) {
        queryClient.setQueryData(["notifications"], ctx?.previousNotif);
      }
      toast.error("Failed update data");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["login-user"],
      });
    },
  });
  return (
    <button
      className="flex-shrink-0 h-fit ml-4 p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
      title="Mark as read"
      disabled={isPending}
      onClick={() => mutate()}
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Check className="w-5 h-5" />
      )}
    </button>
  );
};

export default ButtonMarkA;
