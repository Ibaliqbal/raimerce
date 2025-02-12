import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";
import NextImage from "next/image";
import { useRouter } from "next/router";

type Props = {
  children: ReactNode;
  type: "register" | "signin";
  textMore: string;
  title: string;
};

const AuthLayout = ({ children, type, textMore, title }: Props) => {
  const router = useRouter();
  const callbackUrl = (router.query.callbackUrl as string) || "/";

  return (
    <section className="flex items-center justify-center h-dvh">
      <section className="container max-w-7xl lg:grid lg:grid-cols-2 gap-8 lg:h-[90%] h-full rounded-lg">
        <AnimatePresence mode="wait">
          <motion.section
            initial={{ opacity: 0, translateY: type === "register" ? 60 : -60 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: type === "register" ? -60 : 60 }}
            transition={{ duration: 0.3 }}
            key={type}
            className="lg:w-full flex h-full items-center justify-center lg:ml-3"
          >
            <div className="h-full lg:w-full w-[80%] py-3 grid place-items-center">
              <div className="flex flex-col gap-4 w-full">
                <h1 className="text-center text-xl">{title}</h1>
                <Button
                  type="button"
                  variant="auth"
                  onClick={() =>
                    signIn("google", {
                      callbackUrl,
                    })
                  }
                  className="flex gap-3 items-center text-base py-6"
                >
                  <NextImage
                    src={"/icon/google.svg"}
                    alt="Google"
                    width={25}
                    height={25}
                  />
                  Login with Google
                </Button>
                <Separator />
                {children}
                <div className="items-center justify-center flex ">
                  <div className="flex flex-col gap-4 items-center w-fit">
                    <p>
                      {textMore}{" "}
                      <Link
                        href={`/${
                          type === "register" ? "signin" : "signup"
                        }?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                        className="text-blue-600"
                      >
                        here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
        <figure className="lg:block hidden w-full h-full relative">
          <Image
            src={"/Background-auth.jpg"}
            alt="Auth"
            width={500}
            height={500}
            className="w-full h-full absolute object-cover object-center rounded-lg"
            figureClassName="w-full h-full"
          />
        </figure>
      </section>
    </section>
  );
};

export default AuthLayout;
