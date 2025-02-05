import { Button } from "../ui/button";
import instance from "@/lib/axios/instance";
import { useRouter } from "next/router";
import { TMedia } from "@/types/product";
import { RiLoader5Line } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { useLoadingScreen } from "@/context/loading-screen-context";
import Modal from "../ui/modal";
import { motion } from "framer-motion";

type Props = {
  medias: TMedia[];
  id: string;
};

const ButtonDeleteProduct = ({ medias, id }: Props) => {
  const { push } = useRouter();
  const { setOpen } = useLoadingScreen();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [status, setStatus] = useState<"success" | "error" | "submitting">(
    "success"
  );
  return (
    <>
      <Button
        variant="destructive"
        className="self-end flex items-center gap-2 hover:bg-red-600 transition-colors duration-300"
        onClick={async () => setOpenModal(true)}
      >
        <FaRegTrashAlt />
        Delete
      </Button>
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
            <h1 className="font-bold text-2xl">Delete product</h1>
            <p className="text-lg text-gray-400">
              Are you sure you want to delete this product?
            </p>
            <div className="flex gap-4 justify-end">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="flex items-center gap-2"
                disabled={status === "submitting"}
                onClick={async () => {
                  setStatus("submitting");
                  try {
                    const deletes = medias.map(async (media) => {
                      await instance.delete(`/files/${media.keyFile}`);
                      return;
                    });

                    await Promise.all([
                      deletes,
                      instance.delete(`/users/login/store/products/${id}`),
                    ]);

                    setOpenModal(false);

                    setOpen(true);

                    setStatus("success");

                    push("/my/store/products");
                  } catch (error) {
                    console.log(error);
                    setStatus("error");
                  }
                }}
              >
                {status === "submitting" && (
                  <RiLoader5Line className="animate-spin" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </motion.section>
      </Modal>
    </>
  );
};

export default ButtonDeleteProduct;
