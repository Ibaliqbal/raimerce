import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Modal from "../ui/modal";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "../ui/image";
import { Separator } from "../ui/separator";
import FormCommentProduct from "@/layouts/form/form-comment-product";
import toast from "react-hot-toast";
import instance from "@/lib/axios/instance";
import { useLoadingScreen } from "@/context/loading-screen-context";

type Props = {
  orderID: string;
  productID: string;
  productName: string;
  productVariant: string;
  imageVariant: string;
};

const DropdownProductOrder = ({
  imageVariant,
  productName,
  productVariant,
  orderID,
  productID,
}: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { setOpen } = useLoadingScreen();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="md:self-start self-end">
          <HiOutlineDotsVertical className="text-xl" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenModal(true)}>
            Received
          </DropdownMenuItem>
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
          className="md:w-[700px] w-[320px] h-fit flex flex-col items-center justify-center style-base-modal p-3 py-4"
        >
          <div className="flex flex-col gap-5 w-full px-4 h-[550px] overflow-auto custom-vertical-scroll">
            <h1 className="font-bold text-2xl">
              Berikan komentar anda terhadap produk ini!
            </h1>
            <div className="flex gap-4">
              <Image
                src={imageVariant}
                alt="Product Image"
                width={200}
                height={200}
                figureClassName="w-[150px] h-[150px] relative rounded-md overflow-hidden"
                className="w-full h-full absolute inset-0 rounded-md object-cover object-ccnter group-hover:scale-110 transition-transform duration-300 ease-in-out"
              />
              <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-lg">{productName}</h1>
                <p className="text-base">
                  <strong>Variant</strong> : {productVariant}
                </p>
              </div>
            </div>
            <Separator />
            <FormCommentProduct
              handleSubmit={(data) => {
                toast.promise(
                  async () =>
                    await instance.post(
                      `/products/${productID}/comments?orderId=${orderID}`,
                      data
                    ),
                  {
                    loading: "Loading...",
                    success: (res) => {
                      setOpenModal(false);
                      location.reload();
                      setOpen(true);
                      return res.data.message;
                    },
                    error: () => {
                      return "Internal server error";
                    },
                  }
                );
              }}
              setOpenModal={setOpenModal}
            />
          </div>
        </motion.section>
      </Modal>
    </>
  );
};

export default DropdownProductOrder;
