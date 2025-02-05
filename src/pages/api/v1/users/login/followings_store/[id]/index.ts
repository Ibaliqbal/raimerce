import { db } from "@/lib/db";
import { FollowTable } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/helper";
import { and, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  isFollowing: boolean;
};

const acceptMethod = ["GET", "PUT"];

export default function hanlder(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const storeId = req.query.id as string;

      const data = await db.query.FollowTable.findFirst({
        where: and(
          eq(FollowTable.userId, decoded.id),
          eq(FollowTable.storeId, storeId)
        ),
        columns: {
          id: true,
        },
      });

      if (req.method === "PUT") {
        if (!data) {
          if (decoded.id === storeId)
            return res.status(400).json({
              isFollowing: false,
              statusCode: 400,
              message: "You cannot follow yourself",
            });

          await db.insert(FollowTable).values({
            userId: decoded.id,
            storeId,
          });

          return res.status(200).json({
            message: "Followed",
            statusCode: 200,
            isFollowing: true,
          });
        }

        await db.delete(FollowTable).where(eq(FollowTable.id, data.id));

        return res.status(200).json({
          message: "Unfollow",
          statusCode: 200,
          isFollowing: false,
        });
      }

      if (!data)
        return res.status(200).json({
          message: "Not following",
          statusCode: 200,
          isFollowing: false,
        });

      return res.status(200).json({
        message: "Following",
        statusCode: 200,
        isFollowing: true,
      });
    });
  });
}
