import { ApiResponse, secureMethods, verify } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { NotificationTable, TNotification } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

type Data = ApiResponse & {
  totalPage?: number;
  data?: Array<Pick<TNotification, "id" | "content" | "createdAt" | "isRead">>;
};

const acceptMethods = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const _page = req.query.page as string;
      const _limit = req.query.limit as string;

      if (isNaN(Number(_page)) || isNaN(Number(_limit)))
        return res.status(400).json({
          message: "Invalid page or limit",
          statusCode: 400,
        });

      const data = await db.query.NotificationTable.findMany({
        where: and(
          eq(NotificationTable.userId, decoded.id),
          eq(NotificationTable.type, "order_client")
        ),
        columns: {
          id: true,
          content: true,
          isRead: true,
          createdAt: true,
        },
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
        limit: Number(_limit),
        offset: (Number(_page) - 1) * Number(_limit),
      });

      const totalNotifications = await db.$count(
        NotificationTable,
        and(
          eq(NotificationTable.userId, decoded.id),
          eq(NotificationTable.type, "order_client")
        )
      );

      return res.status(200).json({
        message: "Welcome to the e-commerce API!",
        statusCode: 200,
        data,
        totalPage: Math.ceil(totalNotifications / Number(_limit)),
      });
    });
  });
}
