import Modal from "@/components/ui/modal";
import * as React from "react";
import { motion } from "framer-motion";
import Loader from "@/components/ui/loader";

type LoadingScreenContextType = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

const LoadingScreenContext = React.createContext<LoadingScreenContextType>({
  open: false,
  setOpen: () => {},
});

export const LoadingScreenProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <LoadingScreenContext.Provider value={{ setOpen, open }}>
      {children}
      <Modal open={open} setOpen={() => {}}>
        <motion.div
          className="w-[320px] h-[250px] flex items-center justify-center z-[70] p-3"
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
          }}
          exit={{
            scale: 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            type: "tween",
          }}
        >
          <Loader className="text-white" />
        </motion.div>
      </Modal>
    </LoadingScreenContext.Provider>
  );
};

export const useLoadingScreen = () => {
  const res = React.useContext(LoadingScreenContext);

  return res;
};
