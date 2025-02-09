import { FaEye, FaStar } from "react-icons/fa";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "@/components/ui/image";
import Link from "next/link";
import Card from "../ui/card";
import { TbEyeEdit } from "react-icons/tb";
import { Skeleton } from "../ui/skeleton";
import { TProducts } from "@/lib/db/schema";

type Props = {
  hisMine?: boolean;
  disabledLicnk?: boolean;
  withoutAction?: boolean;
} & Pick<TProducts, "rating" | "description" | "id" | "name" | "variant">;

const CardProduct = ({
  hisMine = false,
  id,
  disabledLicnk = true,
  name,
  variant,
  rating,
  description,
  withoutAction = false,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="rounded-md border border-gray-500 group w-full h-full"
        layoutId={`card-${id}`}
      >
        <Card.Image
          src={variant[0].medias[0].url}
          layoutId={`card-${id}-image`}
          className="md:h-[300px] h-[200px]"
        />
        <Card.Description
          href={`/products/${id}?variant=${variant[0].name_variant}`}
          asLink={disabledLicnk}
          className="grow"
        >
          <h1 className="md:text-base text-sm">{name}</h1>
        </Card.Description>
        <Card.Footer className="items-center">
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span className="md:text-base text-sm">{rating}</span>
          </div>
          {withoutAction ? null : hisMine ? (
            <div className="flex items-center gap-3">
              <FaEye
                className="md:text-xl text-base cursor-pointer"
                onClick={() => setOpen(true)}
              />
              <Link href={`/my/store/products/${id}/update`}>
                <TbEyeEdit className="md:text-xl text-base cursor-pointer" />
              </Link>
            </div>
          ) : (
            <FaEye
              className="md:text-xl text-base cursor-pointer"
              onClick={() => setOpen(true)}
            />
          )}
        </Card.Footer>
      </Card>
      <Modal open={open} setOpen={setOpen}>
        <motion.article
          layoutId={`card-${id}`}
          className="lg:w-[900px] md:w-[500px] w-[320px] h-[500px] flex lg:flex-row flex-col gap-4 overflow-auto style-base-modal p-3"
        >
          <Image
            motionProps={{
              layoutId: `card-${id}-image`,
            }}
            src={variant[0].medias[0].url}
            alt="Product Image"
            width={200}
            height={200}
            figureClassName="lg:w-1/2 w-full h-full relative rounded-md overflow-hidden"
            className="w-full h-full absolute inset-0 rounded-md object-cover object-ccnter group-hover:scale-110 transition-transform duration-300 ease-in-out"
          />
          <section className="lg:w-1/2 w-full max-h-full h-full overflow-auto custom-vertical-scroll flex flex-col gap-2 relative pr-2">
            <h1 className="text-xl blur-background">{name}</h1>
            {description?.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-justify">
                {paragraph.trim()}
              </p>
            ))}
            <Link
              href={
                hisMine
                  ? `/my/store/products/${id}`
                  : `/products/${id}?variant=${variant[0].name_variant}`
              }
              className="self-end hover:underline"
            >
              More detail
            </Link>
          </section>
        </motion.article>
      </Modal>
    </>
  );
};

const CardProductSkeleton = () => {
  return (
    <Card className="rounded-md border border-gray-500">
      <Skeleton className="md:h-[250px] h-[150px] w-full" />
      <Skeleton className="h-[40px] w-full" />
      <Skeleton className="h-[25px] w-full" />
    </Card>
  );
};

CardProduct.Skeleton = CardProductSkeleton;

export default CardProduct;
