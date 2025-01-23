import { useRouter } from "next/router";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const VerificationPaymentView = () => {
  const { query, reload } = useRouter();
  const { isLoading, data } = useQuery({
    queryKey: ["payment-verification", query.orderId],
    queryFn: async () => {
      const { data } = await instance.get(
        `/payment/verification/${query.orderId}`
      );
      return data.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    retry: false,
  });

  if (isLoading)
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <section className="wrapper-page flex flex-col items-center justify-center gap-4 w-[500px] py-4">
      <div>
        <h1 className="text-xl">Payment Verification</h1>
      </div>
      <div className="shadow-md bg-primary-light/5 rounded-md p-4 w-full flex flex-col items-center justify-center">
        <h2>Code Transaction</h2>
        <p>{data.transactionCode}</p>
      </div>
      <div className="grow">
        <DotLottieReact
          loop
          autoplay
          src={`/animation/${
            data.status === "success" ? "success-two" : data.status
          }-animation.json`}
          width={300}
          height={300}
        />
      </div>
      <div className="flex flex-col justify-center gap-4 w-full">
        <div className="shadow-md bg-primary-light/5 rounded-md p-4">
          <h1>Payment Method</h1>
          <p className="mt-3">{data.paymentMethod}</p>
        </div>
        <div className="shadow-md bg-primary-light/5 rounded-md p-4">
          <h1>VA Number</h1>
          <p className="mt-3">{data.vaNumber}</p>
        </div>
        <Button variant="primary" size="xl" onClick={() => reload()}>
          Refresh
        </Button>
        <Button variant="link" size="sm" asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </section>
  );
};

export default VerificationPaymentView;
