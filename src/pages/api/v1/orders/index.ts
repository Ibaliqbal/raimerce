import { db } from "@/lib/db";
import { OrdersTable, TOrder } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/api";
import { and, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<
    Pick<
      TOrder,
      "id" | "products" | "transactionCode" | "status" | "promoCodes"
    >
  >;
  totalPage?: number;
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decoded) => {
      const decode = decoded as JWT;
      const _status = req.query.status as "pending" | "canceled" | "success";
      const _page = req.query.page as string;
      const _limit = req.query.limit as string;

      if (isNaN(Number(_page)) || isNaN(Number(_limit)))
        return res.status(400).json({
          message: "Invalid page or limit",
          statusCode: 400,
        });

      if (_status) {
        const totalOrder = await db.$count(
          OrdersTable,
          and(
            eq(OrdersTable.userId, decode.id),
            eq(OrdersTable.status, _status)
          )
        );
        const data = await db.query.OrdersTable.findMany({
          where: and(
            eq(OrdersTable.userId, decode.id),
            eq(OrdersTable.status, _status)
          ),
          columns: {
            id: true,
            transactionCode: true,
            products: true,
            status: true,
            promoCodes: true,
          },
          orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
          limit: Number(_limit),
          offset: (Number(_page) - 1) * Number(_limit),
        });

        return res.status(200).json({
          message: "Success",
          statusCode: 200,
          data,
          totalPage: Math.ceil(totalOrder / Number(_limit)),
        });
      }

      const totalOrder = await db.$count(
        OrdersTable,
        eq(OrdersTable.userId, decode.id)
      );

      const data = await db.query.OrdersTable.findMany({
        where: eq(OrdersTable.userId, decode.id),
        columns: {
          id: true,
          transactionCode: true,
          products: true,
          status: true,
          promoCodes: true,
        },
        limit: Number(_limit),
        offset: (Number(_page) - 1) * Number(_limit),
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      return res.status(200).json({
        message: "Welcome to the API",
        statusCode: 200,
        data,
        totalPage: Math.ceil(totalOrder / Number(_limit)),
      });
    });
  });
}
