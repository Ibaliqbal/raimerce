import { ComponentPropsWithoutRef, useState } from "react";
import { Button } from "./ui/button";
import Video from "./ui/video";
import { MdClose } from "react-icons/md";
import { RiLoader5Line } from "react-icons/ri";
import Image from "./ui/image";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import instance from "@/lib/axios/instance";
import { ApiResponse } from "@/utils/api";

type Props = {
  type: "image" | "video";
  src: string;
  alt?: string;
  keyFile: string;
  handleDlete: () => void;
  disabled?: boolean;
} & ComponentPropsWithoutRef<"div">;

const MediaPreview = ({
  type,
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
    <div className={cn("relative h-[350px] group", className)} {...rest}>
      {type === "image" ? (
        <Image
          src={src}
          alt={alt ?? "Product"}
          width={250}
          height={450}
          className="rounded-md absolute w-full h-full object-cover object-center"
          figureClassName="w-full h-full relative rounded-md"
        />
      ) : (
        <Video
          src={src}
          aria-label={alt}
          autoPlay
          muted
          loop
          className="rounded-md absolute w-full h-full object-contain object-center"
        />
      )}

      <div
        className={cn(
          "bg-white/55 dark:bg-[#121212]/55 backdrop-blur-md flex items-center justify-center py-2 absolute w-full top-0 left-0 h-full rounded-md transition-opacity duration-300 ease-in group-hover:opacity-100 opacity-0 z-10",
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
            <RiLoader5Line className="text-3xl animate-spin" />
          ) : (
            <MdClose className="text-3xl" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MediaPreview;
