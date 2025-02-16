import { ApiResponse, secureMethods, verify } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { and, eq, gte, lte, ne } from "drizzle-orm";
import {
  OrdersTable,
  ProductsTable,
  StoresTable,
  UsersTable,
} from "@/lib/db/schema";
import { fee, months } from "@/utils/constant";

type Data = ApiResponse & {
  totalUsers?: number;
  totalStores?: number;
  totalProducts?: number;
  totalRevenue?: number;
  data?: Array<
    { month: string; total: number } | { name: string; total: number }
  >;
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const _type = req.query.type as string;

      if (decoded.role !== "admin")
        return res.status(403).json({
          message: "Forbidden",
          statusCode: 403,
        });

      if (_type === "revenue_chart") {
        const range = 3;
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - range);
        const now = new Date();
        const result: Array<{ month: string; total: number }> = [];
        const revenue = await db.query.OrdersTable.findMany({
          where: and(
            lte(OrdersTable.createdAt, now),
            gte(OrdersTable.createdAt, threeMonthsAgo),
            eq(OrdersTable.status, "success")
          ),
          columns: {
            createdAt: true,
          },
        });

        for (let index = 0; index <= range; index++) {
          const setMonth = new Date();
          setMonth.setMonth(setMonth.getMonth() - index);
          const filteredByMonth = revenue.filter(
            (order) => order?.createdAt?.getMonth() === setMonth.getMonth()
          );
          result[index] = {
            month: months[setMonth.getMonth()],
            total: filteredByMonth.length * fee,
          };
        }

        return res.status(200).json({
          message: "Success get revenue chart",
          statusCode: 200,
          data: result.reverse(),
        });
      }

      if (_type === "products_chart") {
        const products = await db.query.ProductsTable.findMany({
          columns: {
            category: true,
          },
        });

        const sortSumProductsByCategory = products
          .reduce((acc: Array<{ name: string; total: number }>, curr) => {
            const findIt = acc.find(
              (product) =>
                product.name.toLowerCase() === curr.category?.toLowerCase()
            );

            if (findIt) {
              findIt.total += 1;
            } else {
              acc.push({
                name: curr.category as string,
                total: 1,
              });
            }

            return acc;
          }, [])
          .sort((a, b) => b.total - a.total);

        // const sortSumProductsByCategory = categories.map((category) => {
        //   const filteredProduct = products.filter(
        //     (product) =>
        //       (product.category as string).toLowerCase() ??
        //       "" === category.name.toLowerCase()
        //   );

        //   console.log(filteredProduct);

        //   return { name: category.name, total: filteredProduct.length };
        // });

        return res.status(200).json({
          message: "Success get products chart",
          statusCode: 200,
          data: sortSumProductsByCategory.slice(0, 5),
        });
      }

      const totalUsers = await db.$count(
        UsersTable,
        and(ne(UsersTable.role, "admin"), ne(UsersTable.nonActive, true))
      );

      const totalProducts = await db.$count(ProductsTable);

      const totalStores = await db.$count(
        StoresTable,
        ne(StoresTable.nonActive, true)
      );

      const totalRevenue = await db.$count(
        OrdersTable,
        eq(OrdersTable.status, "success")
      );

      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        totalUsers,
        totalStores,
        totalProducts,
        totalRevenue: totalRevenue * fee,
      });
    });
  });
}
