import { ThinRoundedStar } from "@smastrom/react-rating";

const ratings = [1, 2, 3, 4, 5];

const banks = ["BCA", "BRI", "BNI", "CIMB"];

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

const pageSizeProduct = 12;

const pageSizeOrders = 2;

const pageSizeCarts = 2;

const pageSizeNotifications = 10;

const pageSizeComments = 8;

const fee = 2000;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export {
  categories,
  myBanners,
  styleReactRating,
  navigationStore,
  effectCarousel,
  ratings,
  banks,
  pageSizeProduct,
  fee,
  pageSizeOrders,
  pageSizeCarts,
  pageSizeNotifications,
  pageSizeComments,
  months,
};
