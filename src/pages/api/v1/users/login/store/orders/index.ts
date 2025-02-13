import { db } from "@/lib/db";
import { OrdersTable, ProductsTable, TOrder, TUser } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { getStoreID } from "@/utils/db";
import { verify } from "@/utils/api";
import { and, arrayContains, eq, gte, lte } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import { TZDate } from "@date-fns/tz";

type Data = ApiResponse & {
  data?: Array<
    Pick<
      TOrder,
      "id" | "products" | "status" | "transactionCode" | "promoCodes"
    > & {
      user: Pick<TUser, "address" | "name" | "email" | "phone"> | null;
    }
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
      const _status = req.query.status as "pending" | "success" | "canceled";
      const _page = req.query.page as string;
      const _limit = req.query.limit as string;
      const _fromDay = req.query.from as string;
      const _toDay = req.query.to as string;

      if (isNaN(Number(_page)) || isNaN(Number(_limit)))
        return res.status(400).json({
          message: "Invalid page or limit",
          statusCode: 400,
        });

      const storeID = await getStoreID(decode.id);

      if (!storeID)
        return res.status(404).json({
          message: "Store not found",
          statusCode: 404,
        });

      const products = await db.query.ProductsTable.findMany({
        where: eq(ProductsTable.storeId, storeID),
        columns: {
          id: true,
        },
      });

      if (_status) {
        const totalOrders = await db.$count(
          OrdersTable,
          and(
            arrayContains(OrdersTable.storeIds, [storeID]),
            eq(OrdersTable.status, _status),
            _fromDay && _toDay
              ? and(
                  gte(
                    OrdersTable.createdAt,
                    new TZDate(new Date(_fromDay), "Asia/Jakarta")
                  ),
                  lte(
                    OrdersTable.createdAt,
                    new TZDate(new Date(_toDay), "Asia/Jakarta")
                  )
                )
              : undefined
          )
        );

        const orders = await db.query.OrdersTable.findMany({
          where: and(
            arrayContains(OrdersTable.storeIds, [storeID]),
            eq(OrdersTable.status, _status),
            _fromDay && _toDay
              ? and(
                  gte(
                    OrdersTable.createdAt,
                    new TZDate(new Date(_fromDay), "Asia/Jakarta")
                  ),
                  lte(
                    OrdersTable.createdAt,
                    new TZDate(new Date(_toDay), "Asia/Jakarta")
                  )
                )
              : undefined
          ),
          columns: {
            id: true,
            products: true,
            transactionCode: true,
            status: true,
            promoCodes: true,
          },
          with: {
            user: {
              columns: {
                name: true,
                address: true,
                email: true,
                phone: true,
              },
            },
          },
          limit: Number(_limit),
          offset: (Number(_page) - 1) * Number(_limit),
          orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
        });

        return res.status(200).json({
          message: "success",
          statusCode: 200,
          data: orders.map((order) => ({
            ...order,
            products:
              order.products?.filter((product) =>
                products.some((p) => p.id === product.productID)
              ) || null,
          })),
          totalPage: Math.ceil(totalOrders / Number(_limit)),
        });
      }

      const totalOrders = await db.$count(
        OrdersTable,
        and(
          arrayContains(OrdersTable.storeIds, [storeID]),
          _fromDay && _toDay
            ? and(
                gte(
                  OrdersTable.createdAt,
                  new TZDate(new Date(_fromDay), "Asia/Jakarta")
                ),
                lte(
                  OrdersTable.createdAt,
                  new TZDate(new Date(_toDay), "Asia/Jakarta")
                )
              )
            : undefined
        )
      );

      const orders = await db.query.OrdersTable.findMany({
        where: and(
          arrayContains(OrdersTable.storeIds, [storeID]),
          _fromDay && _toDay
            ? and(
                gte(
                  OrdersTable.createdAt,
                  new TZDate(new Date(_fromDay), "Asia/Jakarta")
                ),
                lte(
                  OrdersTable.createdAt,
                  new TZDate(new Date(_toDay), "Asia/Jakarta")
                )
              )
            : undefined
        ),
        columns: {
          id: true,
          products: true,
          transactionCode: true,
          status: true,
          promoCodes: true,
        },
        with: {
          user: {
            columns: {
              name: true,
              address: true,
              email: true,
              phone: true,
            },
          },
        },
        limit: Number(_limit),
        offset: (Number(_page) - 1) * Number(_limit),
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        data: orders.map((order) => ({
          ...order,
          products:
            order.products?.filter((product) =>
              products.some((p) => p.id === product.productID)
            ) || null,
        })),
        totalPage: Math.ceil(totalOrders / Number(_limit)),
      });
    });
  });
}
