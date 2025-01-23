import { db } from "@/lib/db";
import { NewsTable, StoresTable, TNews } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse & {
  data?: Array<Pick<TNews, "content" | "createdAt" | "id" | "medias">>;
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    // Your logic here
    const name = req.query.name as string;

    const checkAvaibleStore = await db.query.StoresTable.findFirst({
      where: eq(StoresTable.name, name),
      columns: {
        id: true,
      },
    });

    if (!checkAvaibleStore)
      return res.status(404).json({
        message: "Store not found",
        statusCode: 404,
      });

    const data = await db.query.NewsTable.findMany({
      where: eq(NewsTable.storeId, checkAvaibleStore.id),
      columns: {
        id: true,
        content: true,
        createdAt: true,
        medias: true,
      },
      orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
    });

    return res.status(200).json({
      message: "Successfully get all data news",
      statusCode: 200,
      data,
    });
  });
}
