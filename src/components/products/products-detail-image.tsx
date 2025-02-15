import Image from "@/components/ui/image";
import Carousel from "../ui/carousel";
import { TMedia } from "@/types/product";

type Props = {
  medias: Array<TMedia>;
};

const ProductsDetailImage = ({ medias }: Props) => {
  return (
    <div className="lg:sticky lg:top-3 lg:w-[40%] w-full lg:h-[600px] h-[400px]">
      <Carousel thumb={false} effect="fade">
        {medias.map((media) => (
          <Image
            key={media.keyFile}
            src={media.url}
            alt={media.name}
            width={200}
            height={200}
            figureClassName="w-full h-full relative rounded-lg overflow-hidden"
            className="w-full h-full absolute inset-0 rounded-lg object-cover object-ccnter group-hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        ))}
      </Carousel>
    </div>
  );
};

export default ProductsDetailImage;
