import Image from "@/components/ui/image";
import { TMedia } from "@/types/product";
import { UploadButton } from "@/utils/uploadthing";

interface UploadImageProps {
  url?: string;
  endpoint: "imageUploader" | "uploadHeaderPhotoStore" | "uploadMediaNews";
  onUploadComplete: (media: TMedia) => void;
  isLoading?: boolean;
  alt?: string;
  customHeight?: string;
}

const UploadImageWithPreview = ({
  url,
  endpoint,
  onUploadComplete,
  isLoading,
  alt = "Upload image",
  customHeight,
}: UploadImageProps) => {
  return (
    <div className={`relative w-full ${customHeight} group`}>
      {url ? (
        <Image
          alt={alt}
          src={url}
          figureClassName="w-full h-full relative rounded-xl"
          className="absolute inset-0 w-full h-full object-cover object-center rounded-xl bg-slate-600"
          width={500}
          height={300}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full rounded-xl bg-slate-600" />
      )}
      <div className="w-full h-full absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-black bg-opacity-40 transition-opacity duration-300 ease-linear flex items-center justify-center">
        <UploadButton
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            const media = res[0].serverData?.media;
            if (media) {
              onUploadComplete(media);
            }
          }}
          disabled={isLoading}
          appearance={{
            allowedContent: "hidden",
            button({ ready, isUploading }) {
              if (isUploading) return "";
              return ready
                ? "bg-gray-500 bg-opacity-60 py-2 px-4 z-50"
                : "py-2 px-4 z-50";
            },
            clearBtn(arg) {
              return arg.isUploading ? "-z-10" : "";
            },
          }}
          content={{
            button({ ready, isUploading, uploadProgress }) {
              if (isUploading) return uploadProgress.toString();
              return ready || isLoading ? "Upload" : "Loading...";
            },
          }}
          onBeforeUploadBegin={(files) => {
            return files.map((f) => {
              const timestamp = new Date().getTime();
              return new File([f], `${timestamp}-${f.name}`, {
                type: f.type,
              });
            });
          }}
        />
      </div>
    </div>
  );
};

export default UploadImageWithPreview;
