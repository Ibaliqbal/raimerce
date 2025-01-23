import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"section">;

const Loader = ({ className, ...rest }: Props) => {
  return (
    <section
      className={cn(
        "w-full h-full flex items-center justify-center",
        className
      )}
      {...rest}
    >
      <div className="loader" />
    </section>
  );
};

export default Loader;
