import React from "react";
import Modal from "../ui/modal";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { RiLoader5Line } from "react-icons/ri";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  status: "success" | "error" | "submitting";
  title: string;
  description: string;
  handleYes: () => void;
};

const ModalAlertDelete = ({
  open,
  setOpen,
  status,
  title,
  description,
  handleYes,
}: Props) => {
  return (
    <Modal open={open} setOpen={() => {}}>
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
        className="md:w-[700px] w-[370px] h-fit flex flex-col items-center justify-center overflow-auto style-base-modal p-3 py-10"
      >
        <div className="flex flex-col gap-5 w-full px-10">
          <h1 className="font-bold text-2xl">{title}</h1>
          <p className="md:text-lg text-base dark:text-gray-400 text-gray-500">
            {description}
          </p>
          <div className="flex gap-4 justify-end">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="flex items-center gap-2"
              disabled={status === "submitting"}
              onClick={handleYes}
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
  );
};

export default ModalAlertDelete;
