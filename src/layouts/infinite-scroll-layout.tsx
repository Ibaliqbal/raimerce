import { ComponentPropsWithoutRef } from "react";
import { LuLoader2 } from "react-icons/lu";
import { useInView } from "react-intersection-observer";

const InfiniteScrollLayout = ({
  callback,
  children,
  isFetching,
  ...rest
}: {
  callback: () => void;
  children: React.ReactNode;
  isFetching: boolean;
} & ComponentPropsWithoutRef<"section">) => {
  const { ref } = useInView({
    rootMargin: "100px",
    onChange(inView) {
      if (inView) {
        callback();
      }
    },
  });
  return (
    <section {...rest}>
      {children}
      {isFetching && (
        <div className="w-full items-center justify-center flex mt-3">
          <LuLoader2 className="w-5 h-5 animate-spin " />
        </div>
      )}
      <div ref={ref} />
    </section>
  );
};

export default InfiniteScrollLayout;
