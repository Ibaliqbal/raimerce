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
import { useLoadingScreen } from "@/context/loading-screen-context";
import { useState } from "react";
import ModalAlertDelete from "../modal/modal-alert-delete";

type Props = { id: string };
const DropdownPromo = ({ id }: Props) => {
  const { setOpen } = useLoadingScreen();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [status, setStatus] = useState<"success" | "error" | "submitting">(
    "success"
  );
  return (
    <>
      <div className="self-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <HiOutlineDotsVertical className="text-xl" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/my/store/promo/${encodeURIComponent(id)}/update`}
                className="cursor-pointer"
              >
                Update
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenModal(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ModalAlertDelete
        open={openModal}
        setOpen={setOpenModal}
        title="Delete promo"
        description="Are you sure you want to delete this promo?"
        status={status}
        handleYes={() => {}}
      />
    </>
  );
};

export default DropdownPromo;
