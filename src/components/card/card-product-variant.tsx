import { FaEye } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import Card from "../ui/card";
import { Button } from "../ui/button";
import Modal from "../ui/modal";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "@/components/ui/image";
import Carousel from "../ui/carousel";
import { VariantSchemaT } from "@/types/product";
import { convertPrice } from "@/utils/helper";
import instance from "@/lib/axios/instance";
import { RiLoader5Line } from "react-icons/ri";

type Props = {
  i: number;
  handleRemove: (index: number) => void;
  withDelete?: boolean;
} & VariantSchemaT;

const CardProductVariant = ({
  i,
  name_variant,
  handleRemove,
  price,
  stock,
  medias,
  withDelete = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"submitting" | "success" | "error">(
    "success"
  );

  return (
    <>
      <Card
        className="rounded-md border border-gray-500 group"
        layoutId={`card-${i}`}
      >
        <Card.Image
          src={medias[0].url}
          className="md:h-[300px] aspect-square"
        />
        <Card.Footer className="items-center">
          <Button
            variant="icon"
            size="icon"
            type="button"
            onClick={() => setOpen(true)}
            disabled={status === "submitting"}
          >
            <FaEye className="md:text-xl text-base" />
          </Button>
          {withDelete && (
            <Button
              variant="icon"
              size="icon"
              type="button"
              disabled={status === "submitting"}
              onClick={async () => {
                setStatus("submitting");
                try {
                  const deletes = medias.map(async (media) => {
                    await instance.delete(`/files/${media.keyFile}`);
                    return;
                  });

                  await Promise.all(deletes);

                  handleRemove(i);
                  setStatus("success");
                } catch (error) {
                  console.log(error);
                  setStatus("error");
                }
              }}
            >
              {status === "submitting" ? (
                <RiLoader5Line className="text-xl animate-spin" />
              ) : (
                <BiTrash className="text-red-500 md:text-xl text-base" />
              )}
            </Button>
          )}
        </Card.Footer>
      </Card>
      <Modal open={open} setOpen={setOpen}>
        <motion.article
          layoutId={`card-${i}`}
          className="md:w-[500px] w-[320px] h-[600px] flex flex-col gap-4 overflow-auto style-base-modal p-3"
        >
          <Carousel
            effect="fade"
            thumb
            pagination={false}
            className="w-full"
            autoPlay={false}
          >
            {medias.map((media) => (
              <Image
                key={media.keyFile}
                src={media.url}
                alt={media.name}
                width={200}
                height={200}
                figureClassName="w-full h-full relative rounded-md overflow-hidden"
                className="w-full h-full absolute inset-0 rounded-md object-cover object-ccnter group-hover:scale-110 transition-transform duration-300 ease-in-out"
              />
            ))}
          </Carousel>
          <section className="w-full max-h-full h-full overflow-auto custom-vertical-scroll flex flex-col gap-2 relative pr-2">
            <p>
              <strong>Variant</strong> : {name_variant}
            </p>
            <p>
              <strong>Price</strong> : {convertPrice(price)}
            </p>
            <p>
              <strong>Stock</strong> : {stock}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {medias.map((media) => (
                <Image
                  key={media.keyFile}
                  src={media.url}
                  alt={media.name}
                  width={200}
                  height={200}
                  figureClassName="w-full h-[150px] relative rounded-md overflow-hidden"
                  className="w-full h-full absolute inset-0 rounded-md object-cover object-ccnter group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              ))}
            </div>
          </section>
        </motion.article>
      </Modal>
    </>
  );
};

export default CardProductVariant;
