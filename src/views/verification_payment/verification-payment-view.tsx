import { useRouter } from "next/router";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import useInterval from "@/hooks/useInterval";
import { NumberFlowGroup } from "@number-flow/react";
import { FaRegCopy } from "react-icons/fa";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
const NumberFlow = dynamic(() => import("@number-flow/react"), {
  ssr: false,
});

const VerificationPaymentView = () => {
  const { query, reload } = useRouter();

  const { isLoading, data } = useQuery({
    queryKey: ["payment-verification", query.orderId],
    queryFn: async () => {
      if (!query.orderId) return null;
      return (await instance.get(`/payment/verification/${query.orderId}`)).data
        .data;
    },
    staleTime: Infinity,
  });

  const [timeLeft, setTimeLeft] = useState(0);

  useInterval((timer) => {
    setTimeLeft((prevTime) => {
      if (prevTime <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prevTime - 1;
    });
  }, 1000);

  useEffect(() => {
    if (data?.timeLeft) {
      setTimeLeft(data.timeLeft);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <section className="wrapper-page flex flex-col items-center justify-center gap-4 md:w-[500px] w-full py-4">
      <div>
        <h1 className="text-xl">Payment Verification</h1>
      </div>
      <div className="shadow-md bg-primary-light/5 rounded-md p-4 w-full flex flex-col items-center justify-center">
        <h2>Code Transaction</h2>
        <p>{data?.transactionCode}</p>
      </div>
      <div className="grow">
        {data?.status && (
          <DotLottieReact
            loop
            autoplay
            src={`/animation/${
              data?.status === "success" ? "success-two" : data?.status
            }-animation.json`}
            width={300}
            height={300}
          />
        )}
      </div>
      {data?.status === "pending" && (
        <div className="flex flex-col items-center">
          <h2>Time left</h2>
          <NumberFlowGroup>
            <div className="~text-3xl/4xl flex items-baseline font-semibold">
              <NumberFlow
                trend={-1}
                value={Math.floor(timeLeft / 3600)}
                format={{ minimumIntegerDigits: 2 }}
              />
              <NumberFlow
                trend={-1}
                digits={{ 1: { max: 5 } }}
                prefix=":"
                value={Math.floor((timeLeft % 3600) / 60)}
                format={{ minimumIntegerDigits: 2 }}
              />
              <NumberFlow
                trend={-1}
                prefix=":"
                value={timeLeft % 60}
                digits={{ 1: { max: 5 } }}
                format={{ minimumIntegerDigits: 2 }}
              />
            </div>
          </NumberFlowGroup>
        </div>
      )}
      <div className="italic flex flex-col gap-4">
        <h1>Note : </h1>
        <p>
          Check your email inbox for full information about this transaction
        </p>
      </div>
      <div className="flex flex-col justify-center gap-4 w-full">
        <div className="shadow-md bg-primary-light/5 rounded-md p-4">
          <h1>Payment Method</h1>
          <p className="mt-3">{data?.paymentMethod}</p>
        </div>
        <div className="shadow-md bg-primary-light/5 rounded-md p-4">
          <h1>VA Number</h1>
          <div className="flex items-center justify-between">
            <p className="mt-3">{data?.vaNumber}</p>
            <Button
              size="icon"
              variant="icon"
              onClick={() =>
                toast.promise(
                  async () =>
                    await navigator.clipboard.writeText(data?.vaNumber),
                  {
                    loading: "Loading...",
                    success: "Copied to clipboard",
                    error: "Failed to copy",
                  }
                )
              }
            >
              <FaRegCopy className="text-lg" />
            </Button>
          </div>
        </div>
        <Button variant="primary" size="xl" onClick={() => reload()}>
          Refresh
        </Button>
        <Button variant="link" size="sm" asChild>
          <Link href={"/products?page=1"}>Back to shopping</Link>
        </Button>
      </div>
    </section>
  );
};

export default VerificationPaymentView;
