import React, { useState } from "react";
import NextImage, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { motion, type MotionProps } from "framer-motion";

type Props = {
  figureClassName?: string;
  motionProps?: MotionProps;
} & ImageProps;

const Image = ({
  alt,
  src,
  width,
  height,
  className,
  motionProps,
  figureClassName,
  ...rest
}: Props) => {
  const [loading, setLoading] = useState(true);
  return (
    <motion.figure className={cn(figureClassName)} {...motionProps}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        unoptimized
        onLoad={() => setLoading(false)}
        {...rest}
        sizes="100%"
        className={cn(
          className,
          loading ? "animate-pulse duration-500 bg-gray-700" : ""
        )}
      />
    </motion.figure>
  );
};

export default Image;
