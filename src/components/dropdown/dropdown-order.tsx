import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "react-hot-toast";
import instance from "@/lib/axios/instance";
import { useLoadingScreen } from "@/context/loading-screen-context";
import { TOrder } from "@/lib/db/schema";
import { useState } from "react";
import ModalAlertDelete from "../modal/modal-alert-delete";

type Props = {
  id: string;
  isOwner: boolean;
} & Pick<TOrder, "status" | "products">;

const DropdownOrder = ({ id, status, isOwner, products }: Props) => {
  const { setOpen } = useLoadingScreen();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [statusSubmit, setStatus] = useState<
    "success" | "error" | "submitting"
  >("success");
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <HiOutlineDotsVertical className="text-xl" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={isOwner ? `/my/store/orders/${id}` : `/my/order/${id}`}
              className="cursor-pointer"
            >
              Detail
            </Link>
          </DropdownMenuItem>
          {status === "pending" && !isOwner && (
            <DropdownMenuItem asChild>
              <Link
                href={`/verification_payment?orderId=${id}`}
                className="cursor-pointer"
              >
                Pay
              </Link>
            </DropdownMenuItem>
          )}
          {status === "pending" && !isOwner && (
            <DropdownMenuItem onClick={() => setOpenModal(true)}>
              Cancel
            </DropdownMenuItem>
          )}
          {isOwner &&
            status === "success" &&
            !(
              products?.length ===
              products?.filter(
                (product) =>
                  product.status === "confirmed" ||
                  product.status === "received"
              ).length
            ) && (
              <DropdownMenuItem
                onClick={() =>
                  toast.promise(
                    async () =>
                      await instance.put(
                        `/users/login/store/orders/${id}?type=confirm_order`
                      ),
                    {
                      loading: "Loading...",
                      success: (res) => {
                        setOpen(true);
                        location.reload();
                        return res.data.message;
                      },
                      error: "Internal server error",
                    }
                  )
                }
              >
                Confirm
              </DropdownMenuItem>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalAlertDelete
        open={openModal}
        setOpen={setOpenModal}
        title="Delete order"
        description="Are you sure you want to delete this order?"
        status={statusSubmit}
        handleYes={() => {
          setStatus("submitting");
          toast.promise(
            async () => await instance.put(`/orders/${id}?type=cancel_order`),
            {
              loading: "Loading...",
              success: (res) => {
                setOpenModal(false);
                setStatus("success");
                setOpen(true);
                location.reload();
                return res.data.message;
              },
              error: () => {
                setStatus("error");
                return "Internal server error";
              },
            }
          );
        }}
      />
    </>
  );
};

export default DropdownOrder;
