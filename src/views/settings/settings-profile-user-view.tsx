import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import FormUpdateUser from "@/layouts/form/form-update-user";
import { useTheme } from "next-themes";
import SelectTheme from "@/components/settings/select-theme";
import FormChangePassword from "@/layouts/form/form-change-password";
import { useGetUserLogin } from "@/context/user-context";
import FormAddLocation from "@/layouts/form/form-add-location";
import Link from "next/link";
import { MdLocationOn } from "react-icons/md";
import { UploadButton } from "@/utils/uploadthing";
import { Separator } from "@/components/ui/separator";
import ButtonLogout from "@/components/button/button-logout";

const SettingProfileUserView = () => {
  const { setTheme, theme } = useTheme();
  const data = useGetUserLogin();
  return (
    <section className="lg:col-span-2 flex flex-col gap-5 pb-8">
      <div className="lg:border lg:border-gray-500 lg:rounded-lg lg:p-3 flex flex-col gap-4">
        <h1 className="text-2xl">Profile</h1>
        <div className="flex flex-col gap-3 w-fit items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={data?.user?.avatar?.url}
              alt="Avatar"
              className="object-cover object-center"
            />
            <AvatarFallback>
              <FaUser className="text-4xl" />
            </AvatarFallback>
          </Avatar>
          <UploadButton
            endpoint="imageUploader"
            disabled={data?.updateAvatar.isPending}
            onClientUploadComplete={(res) => {
              data?.updateAvatar.mutate(res[0].serverData.media);
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
        <FormUpdateUser
          name={data?.user?.name as string}
          email={data?.user?.email as string}
          phone={data?.user?.phone as string}
        />
        {data?.user?.address ? (
          <section className="pb-2">
            <h2 className="text-xl font-bold mb-2">Address</h2>
            <div className="flex items-start gap-3 rounded-md">
              <MdLocationOn className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium lg:text-base text-sm">
                  {data?.user?.address
                    ? `${data.user.address.spesific}, ${data.user.address.district}, ${data.user.address.city},
              Indonesia`
                    : "-"}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <FormAddLocation />
        )}
      </div>
      <Separator className="lg:hidden block my-3" />
      <div className="lg:border lg:border-gray-500 lg:rounded-lg lg:p-3 flex flex-col gap-4">
        <h1 className="text-2xl">General Settings</h1>
        <div className="mt-2 flex flex-col gap-3">
          <h3>Theme</h3>

          <SelectTheme
            value={theme || "system"}
            onChnage={(value) => setTheme(value)}
          />
        </div>

        {data?.user?.typeLogin === "credentials" ? (
          <FormChangePassword />
        ) : null}
        {data?.user?.store?.id ? null : (
          <div className="flex flex-col gap-3">
            <h1>Apakah kamu ingin membuat tokomu sendiri ?</h1>
            <Button className="self-start" asChild variant="primary" size="lg">
              <Link href="/getting_started_store">Buat sekarang</Link>
            </Button>
          </div>
        )}
        <ButtonLogout />
      </div>
    </section>
  );
};

export default SettingProfileUserView;
