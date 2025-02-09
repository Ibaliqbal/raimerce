import Card from "@/components/ui/card";
import { TNews } from "@/lib/db/schema";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import ButtonDeleteNews from "../button/button-delete-news";

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
  return (
    <Card id={id.split("-")[0]} key={id.split("-")[0]}>
      <section className="h-[400px] grid md:grid-cols-2 gap-3">
        {medias?.length === 3 ? (
          <>
            <Card.Image src={medias[0].url} className="h-full group" />
            <div className="flex flex-col gap-4">
              <Card.Image src={medias[1].url} className="h-full group" />
              <Card.Image src={medias[2].url} className="h-full group" />
            </div>
          </>
        ) : (
          medias?.map((media) => (
            <Card.Image
              src={media.url}
              className="h-full group"
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
          <p key={index} className="text-justify">
            {paragraph.trim()}
          </p>
        ))}
        <p>{format(new Date(createdAt as Date), "dd MMMM, yyyy")}</p>
      </Card.Description>
      <Card.Footer className="items-center">
        {isOwner && (
          <ButtonDeleteNews
            id={id}
            disabled={disabled}
            handleDelete={handleDelete}
          />
        )}
      </Card.Footer>
    </Card>
  );
};

const CardStoreNewsSkeleton = () => {
  return (
    <Card className="rounded-md border border-gray-500">
      <section className="md:h-[400px] h-[200px] grid md:grid-cols-2 gap-3">
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
