import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { Button } from "../ui/button";
import Image from "../ui/image";
import { TStore } from "@/lib/db/schema";

type Props = Pick<
  TStore,
  "address" | "name" | "headerPhoto" | "description" | "id"
> & {
  productsCount: number;
};

const ProfileStore = ({
  productsCount,
  name,
  description,
  headerPhoto,
}: Props) => {
  return (
    <section className="flex flex-col gap-4 pb-4 border-b border-gray-500">
      {headerPhoto ? (
        <Image
          figureClassName="w-full h-[400px] relative"
          width={500}
          height={500}
          className="w-full h-full absolute inset-0 object-cover object-center rounded-xl"
          alt={headerPhoto.name}
          src={headerPhoto.url}
        />
      ) : (
        <div className="w-full inset-0 h-[400px] rounded-xl bg-slate-600" />
      )}
      <div className="flex flex-col gap-4 px-3 -mt-24">
        <div className="w-40 h-40 p-2 bg-white z-[2] rounded-full dark:bg-[#121212]">
          <Avatar className="w-full h-full">
            <AvatarImage
              src="/Background.jpeg"
              alt="Avatar"
              className="object-cover object-center"
            />
            <AvatarFallback>
              <FaUser className="text-4xl" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl">{name}</h1>
            <Button size="lg">Follow</Button>
          </div>
          <div className="flex items-center gap-4">
            <p>
              Location : <span>Jakarta, Indonesia</span>
            </p>
            <p>Follower : 10000</p>
            <p>Products : {productsCount}</p>
          </div>
        </div>
        <p className={description ? "" : "italic"}>
          {description ?? "No description about this store"}
        </p>
      </div>
    </section>
  );
};

export default ProfileStore;
