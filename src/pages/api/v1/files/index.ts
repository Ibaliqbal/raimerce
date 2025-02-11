import { db } from "@/lib/db";
import { StoresTable } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse;

const acceptMethod = ["POST"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const _type = req.query._type;
    const body = req.body;

    verify(req, res, async (decoded) => {
      const decode = decoded as JWT;

      console.log(body);

      if (_type === "header_photo_store") {
        const checkHeaderPhotoExist = await db.query.StoresTable.findFirst({
          where: eq(StoresTable.userId, decode.id),
          columns: {
            headerPhoto: true,
          },
        });

        if (!checkHeaderPhotoExist) {
          return res.status(200).json({
            message: "Store not found",
            statusCode: 404,
          });
        }

        return res.status(200).json({
          message: "Success upload header photo store",
          statusCode: 200,
        });
      }
    });
  });
}
