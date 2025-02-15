import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import { motion } from "framer-motion";
import SidebarUser from "./sidebar-user";

const SidebarMobile = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button
        size="icon"
        variant="icon"
        className="lg:hidden flex items-center justify-center self-start mb-4"
        onClick={() => setOpenModal(true)}
      >
        <Menu />
      </Button>
      <Modal open={openModal} setOpen={() => {}} isSidebarHamburger>
        <motion.section
          initial={{ translateX: -800 }}
          animate={{
            translateX: 0,
          }}
          exit={{
            translateX: -800,
          }}
          transition={{
            duration: 0.3,
          }}
          className="w-[80%] h-dvh overflow-auto bg-white bg-opacity-90 dark:bg-opacity-10 p-3 pt-6 flex flex-col gap-4"
        >
          <Button
            size="icon"
            variant="icon"
            className="lg:hidden flex items-center justify-center self-start"
            onClick={() => setOpenModal(false)}
          >
            <X />
          </Button>
          <SidebarUser inMobile />
        </motion.section>
      </Modal>
    </>
  );
};

export default SidebarMobile;
