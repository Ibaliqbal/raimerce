import BaseLayout from "@/layouts/base-layout";
import VerificationPaymentView from "@/views/verification_payment/verification-payment-view";

const Page = () => {
  return (
    <BaseLayout title="Payment verif - Raimerce">
      <VerificationPaymentView />
    </BaseLayout>
  );
};

export default Page;
