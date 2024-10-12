import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaRegUser } from "react-icons/fa";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";

const NavbarBase = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    // const previous = scrollY.getPrevious() ?? 0;
    if (latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });
  const isLogin = true;
  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full flex justify-between items-center px-4 py-3 z-[50] blur-background mb-4"
    >
      <h1 className="text-2xl">RAY-COMMERCE</h1>
      {isLogin ? (
        <nav className="flex items-center gap-5">
          <Link href="/">Home</Link>
          <Link href={"/settings"}>
            {" "}
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                <FaRegUser />
              </AvatarFallback>
            </Avatar>
          </Link>
        </nav>
      ) : (
        <Button>Login</Button>
      )}
    </motion.header>
  );
};

export default NavbarBase;
