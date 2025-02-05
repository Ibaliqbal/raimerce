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
import Modal from "../ui/modal";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { RiLoader5Line } from "react-icons/ri";
import { useState } from "react";

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
              products?.filter((product) => product.status === "confirmed")
                .length
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
      <Modal open={openModal} setOpen={() => {}}>
        <motion.section
          initial={{ opacity: 0.2, scale: 0.2 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0.2,
            scale: 0.2,
          }}
          transition={{
            duration: 0.4,
          }}
          className="md:w-[700px] w-[320px] h-fit flex flex-col items-center justify-center overflow-auto style-base-modal p-3 py-10"
        >
          <div className="flex flex-col gap-5 w-full px-10">
            <h1 className="font-bold text-2xl">Canceled order</h1>
            <p className="text-lg text-gray-400">
              Are you sure you want to cancel this order?
            </p>
            <div className="flex gap-4 justify-end">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                No
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="flex items-center gap-2"
                disabled={statusSubmit === "submitting"}
                onClick={async () => {
                  setStatus("submitting");
                  toast.promise(
                    async () =>
                      await instance.put(`/orders/${id}?type=cancel_order`),
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
              >
                {statusSubmit === "submitting" && (
                  <RiLoader5Line className="animate-spin" />
                )}
                Yes
              </Button>
            </div>
          </div>
        </motion.section>
      </Modal>
    </>
  );
};

export default DropdownOrder;
