import { db } from "@/lib/db";
import { FollowTable } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/helper";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse;

const acceptMethod = ["GET"];

export default function hanlder(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;

      const data = await db.query.FollowTable.findMany({
        where: eq(FollowTable.userId, decoded.id),
        columns: {
          id: true,
          storeId: true,
        },
        with: {
          store: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              owner: {
                columns: {
                  avatar: true,
                },
              },
            },
          },
        },
      });

      console.log(data);

      return res.status(200).json({
        message: "Success get all followers",
        statusCode: 200,
      });
    });
  });
}
