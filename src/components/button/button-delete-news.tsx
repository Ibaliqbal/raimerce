import { useState } from "react";
import Modal from "../ui/modal";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { RiLoader5Line } from "react-icons/ri";
import { BiTrash } from "react-icons/bi";

type Props = {
  id: string;
  disabled?: boolean;
  handleDelete: (id: string) => void;
};

const ButtonDeleteNews = ({ handleDelete, id, disabled }: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      <Button variant="icon" size="icon" onClick={() => setOpenModal(true)}>
        <BiTrash className="text-2xl text-red-500 cursor-pointer" />
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
            <h1 className="font-bold text-2xl">Delete news</h1>
            <p className="text-lg text-gray-400">
              Are you sure you want to delete this news?
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
                disabled={disabled}
                onClick={async () => {
                  handleDelete(id);
                  setOpenModal(false);
                }}
              >
                {disabled && <RiLoader5Line className="animate-spin" />}
                Delete
              </Button>
            </div>
          </div>
        </motion.section>
      </Modal>
    </>
  );
};

export default ButtonDeleteNews;
