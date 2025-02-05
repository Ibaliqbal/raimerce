import { db } from "@/lib/db";
import { FollowTable } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { months } from "@/utils/constant";
import { getStoreiD } from "@/utils/db";
import { verify } from "@/utils/helper";
import { and, eq, gte, lte } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type DataResponse = {
  month: string;
  total: number;
};

type Data = ApiResponse & {
  data?: Array<DataResponse>;
  total?: number;
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const range = 3;
      const storeID = await getStoreiD(decoded.id);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - range);
      const now = new Date();
      const result: Array<DataResponse> = [];

      if (!storeID)
        return res.status(404).json({
          message: "Store ID not found",
          statusCode: 404,
        });

      const total = await db.$count(
        FollowTable,
        eq(FollowTable.storeId, storeID)
      );

      const data = await db.query.FollowTable.findMany({
        where: and(
          eq(FollowTable.storeId, storeID),
          lte(FollowTable.createdAt, now),
          gte(FollowTable.createdAt, threeMonthsAgo)
        ),
        columns: {
          id: true,
          createdAt: true,
        },
      });

      for (let index = 0; index <= range; index++) {
        const setMonth = new Date();
        setMonth.setMonth(setMonth.getMonth() - index);
        const filtered = data.filter(
          (follower) => follower.createdAt?.getMonth() === setMonth.getMonth()
        );
        result[index] = {
          month: months[setMonth.getMonth()],
          total: filtered.length,
        };
      }

      return res.status(200).json({
        message: "Success get store data",
        statusCode: 200,
        total,
        data: result.reverse(),
      });
    });
  });
}
