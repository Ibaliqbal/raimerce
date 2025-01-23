import { db } from "@/lib/db";
import { NewsTable, TNews } from "@/lib/db/schema";
import { newsSchema } from "@/types/store";
import { ApiResponse, secureMethods } from "@/utils/api";
import { getStoreiD } from "@/utils/db";
import { verify } from "@/utils/helper";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<Pick<TNews, "content" | "createdAt" | "id" | "medias">>;
};

const acceptMethod = ["GET", "POST"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const body = req.body;
      const storeID = await getStoreiD(decoded.id);
      if (req.method === "POST") {
        const validation = newsSchema.safeParse(body);
        if (!validation.success)
          return res
            .status(400)
            .json({ message: "Invalid data", statusCode: 400 });
        if (!storeID)
          return res.status(404).json({
            message: "Please create your store first",
            statusCode: 404,
          });

        await db.insert(NewsTable).values({
          storeId: storeID,
          content: validation.data.description,
          medias: validation.data.medias,
        });

        return res
          .status(201)
          .json({ message: "New News success created...", statusCode: 201 });
      }

      if (!storeID)
        return res.status(404).json({
          message: "Please create your store first",
          statusCode: 404,
        });

      const data = await db.query.NewsTable.findMany({
        where: eq(NewsTable.storeId, storeID),
        columns: {
          id: true,
          content: true,
          createdAt: true,
          medias: true,
        },
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      return res.status(200).json({
        message: "Successfully",
        statusCode: 200,
        data,
      });
    });
  });
}
