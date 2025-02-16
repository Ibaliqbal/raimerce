import {
  useState,
  useCallback,
  ReactNode,
  Children,
  ComponentPropsWithoutRef,
  memo,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import useInterval from "@/hooks/useInterval";
import { effectCarousel } from "@/utils/constant";

type Props = {
  children: ReactNode[] | ReactNode;
  autoPlay?: boolean;
  interval?: number;
  pagination?: boolean;
  thumb?: boolean;
  effect?: "fade" | "slide" | "slideAndOpacity";
} & ComponentPropsWithoutRef<"section">;

const Carousel = ({
  children,
  autoPlay = true,
  interval = 5000,
  pagination = true,
  thumb = true,
  effect = "fade",
  className,
  ...rest
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const childrenArray = Children.toArray(children);

  const changeSlide = useCallback(
    (direction: "next" | "prev") => {
      setCurrentIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % childrenArray.length;
        } else {
          return (prevIndex - 1 + childrenArray.length) % childrenArray.length;
        }
      });
    },
    [childrenArray.length]
  );

  useInterval(() => {
    if (autoPlay) {
      changeSlide("next");
    }
  }, interval);

  return (
    <section
      className={cn(
        "w-full h-full md:rounded-xl rounded-md group relative overflow-hidden",
        className
      )}
      {...rest}
    >
      {thumb && childrenArray.length > 1 ? (
        <button
          className="text-4xl absolute left-2 z-[2] top-1/2 -translate-y-1/2 cursor-pointer text-white"
          onClick={() => changeSlide("prev")}
          aria-label="Previous slide"
          type="button"
        >
          <MdOutlineKeyboardArrowLeft />
        </button>
      ) : null}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={effectCarousel[effect]}
          initial={"enter"}
          animate={"animate"}
          exit={"exit"}
          transition={{ duration: 0.5, ease: "linear" }}
          className="w-full h-full"
        >
          {childrenArray[currentIndex]}
        </motion.div>
      </AnimatePresence>
      <div className="w-full h-full absolute inset-0 rounded-xl bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
      {thumb && childrenArray.length > 1 ? (
        <button
          className="text-4xl absolute right-2 z-[2] top-1/2 -translate-y-1/2 cursor-pointer text-white"
          onClick={() => changeSlide("next")}
          aria-label="Next slide"
          type="button"
        >
          <MdOutlineKeyboardArrowRight />
        </button>
      ) : null}
      {pagination ? (
        <div className="md:flex hidden items-center gap-2 absolute bottom-3 left-1/2 -translate-x-1/2">
          {childrenArray.map((_, i) => (
            <button
              className={cn(
                "bg-white rounded-full cursor-pointer transition-all duration-500 ease-in-out",
                i === currentIndex
                  ? "bg-opacity-100 h-2 w-5"
                  : "bg-opacity-40 h-2 w-2"
              )}
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default memo(Carousel);
