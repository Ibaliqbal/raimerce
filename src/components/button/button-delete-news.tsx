import { useState } from "react";
import { Button } from "../ui/button";
import { BiTrash } from "react-icons/bi";
import ModalAlertDelete from "../modal/modal-alert-delete";

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
      <ModalAlertDelete
        open={openModal}
        setOpen={setOpenModal}
        title="Delete news"
        description="Are you sure you want to delete this news?"
        status={disabled ? "submitting" : "success"}
        handleYes={async () => {
          handleDelete(id);
          setOpenModal(false);
        }}
      />
    </>
  );
};

export default ButtonDeleteNews;
