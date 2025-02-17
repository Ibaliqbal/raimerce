import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { ProductsTable, TStore, TUser } from "@/lib/db/schema";
import { count, eq, sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

type Data = ApiResponse & {
  data?: Array<
    Pick<TStore, "name" | "address" | "createdAt" | "id" | "nonActive"> & {
      owner: Pick<TUser, "email">;
      totalProducts: number;
    }
  >;
  totalStores?: number;
  activeStores?: number;
};

const acceptMethods = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, async () => {
    const _type = req.query.type as string;

    if (_type === "stores_summary") {
      const totalStores = await db.query.StoresTable.findMany({
        columns: {
          nonActive: true,
          address: true,
        },
      });

      return res.status(200).json({
        message: "Welcome to the API",
        statusCode: 200,
        totalStores: totalStores.length,
        activeStores: totalStores.filter((store) => !store.nonActive).length,
      });
    }

    const productsCount = (storeId: AnyPgColumn) =>
      db
        .select({ count: count() })
        .from(ProductsTable)
        .where(eq(ProductsTable.storeId, storeId));

    const data = await db.query.StoresTable.findMany({
      columns: {
        name: true,
        address: true,
        createdAt: true,
        id: true,
        nonActive: true,
      },
      with: {
        owner: {
          columns: {
            email: true,
          },
        },
      },
      extras: ({ id }) => ({
        totalProducts: sql`${productsCount(id)}`
          .mapWith(Number)
          .as("totalProducts"),
      }),
    });

    res.status(200).json({
      message: "Welcome to the API",
      statusCode: 200,
      data,
    });
  });
}
