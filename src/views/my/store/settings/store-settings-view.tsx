import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import UploadImageWithPreview from "@/components/upload-image-with-preview";
import { useGetStoreOwner } from "@/context/store-context";
import FormUpdateStore from "@/layouts/form/form-update-store";

const StoreSettingsView = () => {
  const data = useGetStoreOwner();
  return (
    <section className="col-span-2 flex flex-col gap-5 pb-8">
      <div className="lg:border lg:border-gray-500 lg:rounded-md lg:p-3 flex flex-col gap-4">
        <h1 className="text-2xl">Profile</h1>

        <UploadImageWithPreview
          endpoint="uploadHeaderPhotoStore"
          url={data?.store?.headerPhoto?.url}
          customHeight={"md:h-[300px] h-[200px]"}
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
      <div className="lg:border lg:border-gray-500 lg:rounded-lg lg:p-3 flex flex-col gap-4">
        <h1 className="text-2xl">General Settings</h1>
        <div className="flex items-center justify-between text-lg">
          <Label htmlFor="airplane-mode">
            Activied whatsapp popup to your page store and some your product
          </Label>
          <Switch
            id="airplane-mode"
            disabled={data?.handleUpdatePopup.isPending || data?.loading}
            checked={data?.store?.popupWhatsapp}
            onCheckedChange={() => data?.handleUpdatePopup.mutate()}
          />
        </div>
      </div>
    </section>
  );
};

export default StoreSettingsView;
