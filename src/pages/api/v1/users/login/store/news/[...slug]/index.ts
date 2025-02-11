import instance from "@/lib/axios/instance";
import { db } from "@/lib/db";
import { NewsTable, StoresTable } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

const acceptMehotd = ["DELETE"];

type Data = ApiResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMehotd, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const id = req.query.slug![0];

      const checkHasStore = await db.query.StoresTable.findFirst({
        where: eq(StoresTable.userId, decoded.id),
        columns: {
          id: true,
        },
      });

      const news = await db.query.NewsTable.findFirst({
        where: eq(NewsTable.id, id),
        columns: {
          id: true,
          storeId: true,
          medias: true,
        },
      });

      if (!news)
        return res.status(404).json({
          message: "News not found",
          statusCode: 404,
        });

      if (news.storeId !== checkHasStore?.id)
        return res.status(403).json({
          message: "Access denied",
          statusCode: 403,
        });

      const deletesMedia = news.medias?.map(async (media) => {
        await instance.delete(`/files/${media.keyFile}`);
        return;
      });

      await Promise.all([
        deletesMedia,
        db.delete(NewsTable).where(eq(NewsTable.id, news.id)),
      ]);

      return res.status(200).json({
        message: "News success deleted",
        statusCode: 200,
      });
    });
  });
}
