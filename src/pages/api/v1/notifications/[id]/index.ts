import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { NotificationTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Data = ApiResponse;

const acceptMethods = ["PUT"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, async () => {
    const _id = req.query.id as string;
    // your code here

    await db
      .update(NotificationTable)
      .set({
        isRead: true,
      })
      .where(eq(NotificationTable.id, _id));

    res.status(200).json({
      message: "Marked as read successful",
      statusCode: 200,
    });
  });
}
