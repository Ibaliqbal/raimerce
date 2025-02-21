import { Phone } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  phoneNumber: string;
};
const Popupwhatsapp = ({ phoneNumber }: Props) => {
  const message =
    "Halo! Saya tertarik dengan product Anda. Bisakah Anda memberi saya informasi lebih lanjut?"; // Customize this message

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/62${phoneNumber.slice(1)}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="rounded-full w-14 h-14 shadow-lg"
        variant="checkout"
        onClick={handleWhatsAppClick}
      >
        <Phone className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Popupwhatsapp;
