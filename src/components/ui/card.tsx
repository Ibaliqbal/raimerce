import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "../ui/image";
import Link from "next/link";

const Card = ({
  children,
  className,
  ...rest
}: MotionProps &
  ComponentPropsWithoutRef<"article"> & {
    children: ReactNode;
  }) => {
  return (
    <motion.article
      className={cn(className, "p-3 flex flex-col gap-3")}
      {...rest}
    >
      {children}
    </motion.article>
  );
};

const CardImage = ({
  src,
  className,
  ...rest
}: ComponentPropsWithoutRef<"div"> &
  MotionProps & {
    src: string;
  }) => {
  return (
    <motion.div className={cn(className)} {...rest}>
      <Image
        src={src}
        alt="Product Image"
        width={200}
        height={200}
        figureClassName="w-full h-full relative rounded-md overflow-hidden"
        className="w-full h-full absolute inset-0 rounded-md object-cover object-ccnter group-hover:scale-110 transition-transform duration-300 ease-in-out"
      />
    </motion.div>
  );
};

const CardDescription = ({
  children,
  className,
  href,
  asLink,
  ...rest
}: ComponentPropsWithoutRef<"a" | "div"> & {
  children: ReactNode;
  asLink: boolean;
  href?: string;
}) => {
  if (asLink)
    return (
      <Link
        href={href as string}
        className={cn(className, "flex flex-col gap-2")}
        {...(rest as ComponentPropsWithoutRef<"a">)}
      >
        {children}
      </Link>
    );

  return (
    <div
      className={cn(className, "flex flex-col gap-2")}
      {...(rest as ComponentPropsWithoutRef<"div">)}
    >
      {children}
    </div>
  );
};

const CardFooter = ({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<"footer"> & {
  children: ReactNode;
}) => {
  return (
    <footer
      className={cn(className, "flex items-center justify-between gap-2")}
      {...rest}
    >
      {children}
    </footer>
  );
};

Card.Description = CardDescription;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
