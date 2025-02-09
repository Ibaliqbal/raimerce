import { ComponentPropsWithoutRef, useState } from "react";
import { Button } from "./ui/button";
import { MdClose } from "react-icons/md";
import { RiLoader5Line } from "react-icons/ri";
import Image from "./ui/image";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import instance from "@/lib/axios/instance";
import { ApiResponse } from "@/utils/api";

type Props = {
  src: string;
  alt?: string;
  keyFile: string;
  handleDlete: () => void;
  disabled?: boolean;
} & ComponentPropsWithoutRef<"div">;

const MediaPreview = ({
  src,
  alt,
  className,
  keyFile,
  disabled,
  handleDlete,
  ...rest
}: Props) => {
  const [status, setStatus] = useState<"submitting" | "success" | "error">(
    "success"
  );
  return (
    <div
      className={cn("relative md:h-[350px] h-[200px] group", className)}
      {...rest}
    >
      <Image
        src={src}
        alt={alt ?? "Product"}
        width={250}
        height={450}
        className="rounded-md absolute w-full h-full object-cover object-center"
        figureClassName="w-full h-full relative rounded-md"
      />
      <div
        className={cn(
          "bg-white/55 dark:bg-[#121212]/55 lg:backdrop-blur-md backdrop-blur-sm flex items-center justify-center py-2 absolute w-full top-0 left-0 h-full rounded-md transition-opacity duration-300 ease-in lg:group-hover:opacity-100 lg:opacity-0 opacity-100 z-10",
          status === "submitting" && "opacity-100"
        )}
      >
        <Button
          variant="icon"
          size="icon"
          type="button"
          disabled={status === "submitting" || disabled}
          onClick={async () => {
            setStatus("submitting");
            try {
              const res = await instance.delete<ApiResponse>(
                `/files/${keyFile}`
              );
              toast.success(res.data.message);
              setStatus("success");
              handleDlete();
            } catch (error) {
              if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
                setStatus("error");
              }
            }
          }}
        >
          {status === "submitting" ? (
            <RiLoader5Line className="md:text-3xl text-xl animate-spin" />
          ) : (
            <MdClose className="md:text-3xl text-xl" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MediaPreview;
