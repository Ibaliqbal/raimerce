import type { TComment } from "@/lib/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { CornerDownRight, Calendar } from "lucide-react";
import Card from "../ui/card";

type Props = TComment;

const CardComment = ({ createdAt, content, medias }: Props) => {
  return (
    <Card className="mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm sm:text-lg font-semibold break-all">
              iqbalmuthahhary@gmail.com
            </h3>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <time dateTime={createdAt?.toISOString()}>
                {format(createdAt as Date, "do MMM yyyy")}
              </time>
            </div>
          </div>
        </div>
        <div className="pl-0 sm:pl-16 space-y-2">
          <div className="flex items-start space-x-2">
            <CornerDownRight className="hidden sm:block w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-xs sm:text-sm text-justify leading-relaxed">
              {content}
            </p>
          </div>
          {medias && medias.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-4">
              {medias.map((media, i) => (
                <div
                  key={i}
                  className="relative group overflow-hidden rounded-md"
                >
                  <Card.Image
                    src={media.url || "/placeholder.svg"}
                    className="w-full h-[150px] sm:h-[200px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CardComment;
