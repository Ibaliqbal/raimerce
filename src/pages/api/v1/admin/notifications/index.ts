import { ApiResponse, secureMethods, verify } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NotificationTable, TNotification } from "@/lib/db/schema";

type Data = ApiResponse & {
  data?: Array<Pick<TNotification, "id" | "content" | "createdAt" | "isRead">>;
  totalPage?: number;
};

const acceptMethods = ["GET"];

export default function hanlder(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const _page = req.query.page as string;
      const _limit = req.query.limit as string;

      if (decoded.role !== "member")
        return res.status(403).json({
          message: "Forbidden",
          statusCode: 403,
        });

      const data = await db.query.NotificationTable.findMany({
        where: eq(NotificationTable.type, "report_to_system"),
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
      const totalNotif = await db.$count(
        NotificationTable,
        eq(NotificationTable.type, "report_to_system")
      );

      return res.status(200).json({
        message: "Welcome to the e-commerce API!",
        statusCode: 200,
        data,
        totalPage: Math.ceil(totalNotif / Number(_limit)),
      });
    });
  });
}
