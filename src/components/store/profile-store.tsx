import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import Image from "../ui/image";
import { TStore, TUser } from "@/lib/db/schema";
import { MdLocationOn } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoBagHandleSharp } from "react-icons/io5";
import ButtonFollow from "../button/button-follow";

type Props = Pick<
  TStore,
  "address" | "name" | "headerPhoto" | "description" | "id"
> & {
  productsCount: number;
  followersCount: number;
  owner: Pick<TUser, "avatar">;
};

const ProfileStore = ({
  productsCount,
  name,
  description,
  headerPhoto,
  followersCount,
  id,
  owner,
  address,
}: Props) => {
  return (
    <section className="flex flex-col gap-4 pb-4 border-b border-gray-500">
      {headerPhoto?.url ? (
        <Image
          figureClassName="w-full md:h-[400px] h-[250px] relative"
          width={500}
          height={500}
          className="w-full h-full absolute inset-0 object-cover object-center rounded-xl"
          alt={headerPhoto.name}
          src={headerPhoto.url}
        />
      ) : (
        <div className="w-full inset-0 md:h-[400px] h-[250px] rounded-xl bg-gray-800" />
      )}
      <div className="flex flex-col gap-4 px-3 -mt-24">
        <div className="w-40 h-40 p-2 bg-white z-[2] rounded-full dark:bg-[#121212]">
          <Avatar className="w-full h-full">
            <AvatarImage
              src={owner.avatar?.url}
              alt="Avatar"
              className="object-cover object-center"
            />
            <AvatarFallback>
              <FaUser className="text-4xl" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{name}</h1>
            <ButtonFollow id={id} />
          </div>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-2">
              <MdLocationOn className="text-gray-500 text-lg" />
              <a
                target="_blank"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  address?.spesific + ", " + address?.city + ", Indonesia"
                )}`}
              >
                {address?.city}, Indonesia
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FaUsers className="text-gray-500 text-lg" />{" "}
              <span>{followersCount}</span>
            </p>
            <p className="flex items-center gap-2">
              <IoBagHandleSharp className="text-gray-500 text-lg" />
              <span>{productsCount}</span>
            </p>
          </div>
        </div>
        <p className={description ? "text-lg" : "italic"}>
          {description ?? "No description about this store"}
        </p>
      </div>
    </section>
  );
};

export default ProfileStore;
