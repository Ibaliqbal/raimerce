import React from "react";
import { motion } from "framer-motion";
import Card from "../ui/card";
import { Bell } from "lucide-react";
import { TNotification } from "@/lib/db/schema";
import { formatDistanceToNowStrict } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import ButtonMarkAsRead from "../button/button-mark-as-read";

type Props = Pick<TNotification, "content" | "createdAt" | "isRead" | "id">;
const CardNotification = ({ content, createdAt, isRead, id }: Props) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 
        ${
          isRead ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-gray-800"
        }`}
    >
      <Card.Description
        asLink={false}
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex space-x-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative
                          ${
                            isRead
                              ? "bg-gray-100 dark:bg-gray-700"
                              : "bg-blue-100 dark:bg-gray-700"
                          }`}
          >
            <Bell
              className={`w-5 h-5 ${
                isRead
                  ? "text-gray-600 dark:text-gray-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            />
            {!isRead && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`md:text-base text-sm font-medium text-justify ${
                isRead
                  ? "text-gray-900 dark:text-gray-200"
                  : "text-blue-900 dark:text-blue-200"
              }`}
            >
              {content}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNowStrict(createdAt as Date)} ago
            </p>
          </div>
          {!isRead && <ButtonMarkAsRead id={id} />}
        </div>
      </Card.Description>
    </motion.div>
  );
};

const CardNotificationSkeleton = () => {
  return (
    <Card className="border border-gray-500 rounded-md">
      <Skeleton className="h-[120px] w-full" />
    </Card>
  );
};

CardNotification.Skeleton = CardNotificationSkeleton;

export default CardNotification;
