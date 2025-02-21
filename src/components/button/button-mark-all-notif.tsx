import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import instance from "@/lib/axios/instance";
import { useLoadingScreen } from "@/context/loading-screen-context";

type Props = {
  user: "client" | "store";
};

const ButtonMarkAllNotif = ({ user }: Props) => {
  const [submit, setSubmit] = useState(false);
  const { setOpen } = useLoadingScreen();

  return (
    <Button
      size="lg"
      variant="primary"
      className="flex items-center gap-2"
      onClick={() => {
        setSubmit(true);
        toast.promise(
          async () =>
            await instance.put(
              user === "client"
                ? "/notifications"
                : "/users/login/store/notifications"
            ),
          {
            loading: "Loading...",
            success: (res) => {
              setSubmit(false);
              setOpen(true);
              location.reload();
              return res.data.message;
            },
            error: () => {
              setSubmit(false);
              return "Failed to mark all notifications as read";
            },
          }
        );
      }}
      disabled={submit}
    >
      {submit && <Loader2 className="animate-spin" />}
      Mark all as read
    </Button>
  );
};

export default ButtonMarkAllNotif;
