import { Button } from "../ui/button";
import instance from "@/lib/axios/instance";
import { useRouter } from "next/router";
import { TMedia } from "@/types/product";
import { BiTrash } from "react-icons/bi";
import { useState } from "react";
import { useLoadingScreen } from "@/context/loading-screen-context";
import ModalAlertDelete from "../modal/modal-alert-delete";

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
        <BiTrash />
        Delete
      </Button>
      <ModalAlertDelete
        open={openModal}
        setOpen={setOpenModal}
        title="Delete product"
        description="Are you sure you want to delete this product?"
        status={status}
        handleYes={async () => {
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
      />
    </>
  );
};

export default ButtonDeleteProduct;
