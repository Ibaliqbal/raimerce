import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { RiLoader5Line } from "react-icons/ri";
import { ApiResponse } from "@/utils/api";

type Props = {
  id: string;
  className?: string;
};

const ButtonFollow = ({ id, className }: Props) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["followings-store", id],
    queryFn: async () =>
      (await instance.get(`/users/login/followings_store/${id}`)).data,
    staleTime: Infinity,
  });
  const { mutate } = useMutation({
    mutationFn: async () =>
      await instance.put(`/users/login/followings_store/${id}`),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["followings-store", id],
      });
      const previousData = queryClient.getQueryData<
        ApiResponse & {
          isFollowing: boolean;
        }
      >(["followings-store", id]);

      queryClient.setQueryData(["followings-store", id], () => ({
        ...previousData,
        isFollowing: !previousData?.isFollowing,
      }));

      return { previousData };
    },
    onError: (err, _, ctx) => {
      queryClient.setQueryData(["followings-store", id], ctx?.previousData);
    },
  });
  return (
    <Button size="lg" className={className} onClick={() => mutate()}>
      {isLoading ? (
        <RiLoader5Line className="animate-spin text-lg" />
      ) : data.isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default ButtonFollow;
