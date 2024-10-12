import { ThinRoundedStar } from "@smastrom/react-rating";

const categories = [
  {
    image: "/icon/fashions-icon.png",
    name: "Fashion",
  },
  {
    image: "/icon/electronics-icon.png",
    name: "Electronic",
  },
  {
    image: "/icon/skincare-icon.png",
    name: "Skincare",
  },
  {
    image: "/icon/foods-icon.png",
    name: "Foods",
  },
  {
    image: "/icon/furnitures-icon.png",
    name: "Furnitures",
  },
  {
    image: "/icon/sports-icon.png",
    name: "Sports",
  },
  {
    image: "/icon/otomotif-icon.png",
    name: "Otomotif",
  },
];

const myBanners = [
  "/Banner1.png",
  "/Banner2.png",
  "/Banner3.png",
  "/Banner4.png",
];

const variants = [
  {
    type: "XXXL",
    stock: 20,
    priceAfterDisc: 10000,
    priceBeforeDisc: 20000,
  },
  {
    type: "XXL",
    stock: 30,
    priceAfterDisc: 15000,
    priceBeforeDisc: 22500,
  },
  {
    type: "XL",
    stock: 40,
    priceAfterDisc: 20000,
    priceBeforeDisc: 28000,
  },
  {
    type: "L",
    stock: 50,
    priceAfterDisc: 13000,
    priceBeforeDisc: 24000,
  },

  {
    type: "M",
    stock: 60,
    priceAfterDisc: 12500,
    priceBeforeDisc: 21000,
  },
  {
    type: "S",
    stock: 70,
    priceAfterDisc: 11000,
    priceBeforeDisc: 19000,
  },
  {
    type: "XS",
    stock: 80,
    priceAfterDisc: 11500,
    priceBeforeDisc: 19500,
  },
  {
    type: "XXS",
    stock: 90,
    priceAfterDisc: 12000,
    priceBeforeDisc: 18000,
  },
  {
    type: "XXXS",
    stock: 100,
    priceAfterDisc: 9000,
    priceBeforeDisc: 15000,
  },
];

export type VariantT = {
  stock: number;
  type: string;
  priceAfterDisc: number;
  priceBeforeDisc: number;
};

const styleReactRating = {
  itemShapes: ThinRoundedStar,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#fbf1a9",
};

const navigationStore = (name: string) =>
  name
    ? [
        {
          name: "News",
          href: `/store/${name}`,
        },
        {
          name: "Products",
          href: `/store/${name}/products`,
        },
      ]
    : [];

const fadeCarousel = {
  enter: {
    opacity: 0.5,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const slideCarousel = {
  enter: {
    x: "100%",
  },
  animate: {
    x: 0,
  },
  exit: {
    x: "-100%",
  },
};

const slideAndOpacityCarousel = {
  initial: {
    opacity: 0.5,
    x: "100%",
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: "-100%",
  },
};

const effectCarousel = {
  fade: fadeCarousel,
  slide: slideCarousel,
  slideAndOpacity: slideAndOpacityCarousel,
};

const filterPopularProducts = ["selling", "rating"];

export {
  categories,
  myBanners,
  variants,
  styleReactRating,
  navigationStore,
  effectCarousel,
  filterPopularProducts,
};
