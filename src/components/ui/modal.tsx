import { motion, AnimatePresence } from "framer-motion";
import { Fragment, useEffect, useCallback } from "react";

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, setOpen, children }) => {
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="fixed h-dvh w-full inset-0 bg-black bg-opacity-60 z-[61] flex items-center justify-center"
            onClick={handleClose}
          >
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default Modal;
