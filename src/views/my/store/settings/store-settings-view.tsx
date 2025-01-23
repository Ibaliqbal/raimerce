import UploadImageWithPreview from "@/components/upload-image-with-preview";
import { useGetStoreOwner } from "@/context/store-context";
import FormUpdateStore from "@/layouts/form/form-update-store";

const StoreSettingsView = () => {
  const data = useGetStoreOwner();
  return (
    <section className="col-span-2 flex flex-col gap-5">
      <div className="border-2 border-gray-500 rounded-md p-3 flex flex-col gap-4">
        <h1 className="text-2xl">Profile</h1>

        <UploadImageWithPreview
          endpoint="uploadHeaderPhotoStore"
          url={data?.store?.headerPhoto?.url}
          customHeight={300}
          onUploadComplete={(media) => data?.handleUpdateHeader.mutate(media)}
          isLoading={data?.handleUpdateHeader.isPending}
          alt={data?.store?.headerPhoto?.name}
        />

        <FormUpdateStore
          name={data?.store?.name as string}
          description={data?.store?.description as string}
          email={data?.store?.owner?.email as string}
        />
      </div>
      {/* <div className="border-2 border-gray-500 rounded-md p-3 flex flex-col gap-4">
        <h1 className="text-2xl">Other</h1>
        <div className="relative w-full h-[300px] group">
          <Image
            alt="Header photo"
            src={"/Banner1.png"}
            figureClassName="w-full h-full relative rounded-xl"
            className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
            width={500}
            height={300}
          />
          <div className="w-full h-full absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-black bg-opacity-40 transition-opacity duration-300 ease-linear flex items-center justify-center">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
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
                  return ready ? "Upload" : "Loading...";
                },
              }}
            />
          </div>
        </div>

        <FormUpdateStore
          name={data?.store?.name as string}
          description={data?.store?.description as string}
          email={data?.store?.owner?.email as string}
        />
      </div> */}
    </section>
  );
};

export default StoreSettingsView;
