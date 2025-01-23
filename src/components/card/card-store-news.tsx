import Card from "@/components/ui/card";
import { TNews } from "@/lib/db/schema";
import { format } from "date-fns";
import { BiShareAlt, BiTrash } from "react-icons/bi";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
// import { toast } from "sonner";

type Props = {
  isOwner?: boolean;
  handleDelete: (id: string) => void;
  disabled?: boolean;
} & Pick<TNews, "content" | "createdAt" | "id" | "medias">;

const CardStoreNews = ({
  isOwner = false,
  content,
  createdAt,
  id,
  medias,
  handleDelete,
  disabled = false,
}: Props) => {
  // const handleShare = async () => {
  //   await navigator.clipboard.writeText(
  //     `${process.env.NEXT_PUBLIC_APP_URL}`
  //   );
  //   toast.success("Copied to clipboard");
  // };

  return (
    <Card>
      <section className="h-[400px] grid grid-cols-2 gap-3">
        {medias?.length === 3 ? (
          <>
            <Card.Image src="/Banner4.png" className="h-full" />
            <div className="flex flex-col gap-4">
              <Card.Image src="/Banner4.png" className="h-full" />
              <Card.Image src="/Banner4.png" className="h-full" />
            </div>
          </>
        ) : (
          medias?.map((media) => (
            <Card.Image
              src={media.url}
              className="h-full"
              key={media.keyFile}
            />
          ))
        )}
      </section>
      <Card.Description
        asLink={false}
        className="pb-4 border-b border-gray-500 flex flex-col gap-3"
      >
        {content?.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph.trim()}</p>
        ))}
        <p>{format(new Date(createdAt as Date), "dd MMMM, yyyy")}</p>
      </Card.Description>
      <Card.Footer>
        {isOwner && (
          <Button
            variant="icon"
            size="icon"
            onClick={() => handleDelete(id)}
            disabled={disabled}
          >
            <BiTrash className="text-2xl text-red-500 cursor-pointer" />
          </Button>
        )}
        <Button
          variant="icon"
          size="icon"
          disabled={disabled}
          // onClick={() => {}}
        >
          <BiShareAlt className="text-2xl cursor-pointer" />
        </Button>
      </Card.Footer>
    </Card>
  );
};

const CardStoreNewsSkeleton = () => {
  return (
    <Card className="rounded-md border border-gray-500">
      <section className="h-[400px] grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton className="h-full w-full" key={i} />
        ))}
      </section>
      <Skeleton className="h-[40px] w-full" />
      <Skeleton className="h-[25px] w-full" />
    </Card>
  );
};

CardStoreNews.Skeleton = CardStoreNewsSkeleton;

export default CardStoreNews;
