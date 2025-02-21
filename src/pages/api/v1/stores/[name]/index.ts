import { db } from "@/lib/db";
import {
  FollowTable,
  ProductsTable,
  StoresTable,
  TStore,
  TUser,
} from "@/lib/db/schema";
import type { NextApiRequest, NextApiResponse } from "next";
import { eq } from "drizzle-orm";
import { ApiResponse, secureMethods } from "@/utils/api";

type Data = ApiResponse & {
  data?: Pick<
    TStore,
    "address" | "name" | "headerPhoto" | "description" | "id" | "popupWhatsapp"
  > & {
    productsCount: number;
    followersCount: number;
    owner: Pick<TUser, "avatar" | "phone">;
  };
};
const acceptMethod = ["GET"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const name = req.query.name as string;
    const data = await db.query.StoresTable.findFirst({
      where: eq(StoresTable.name, name),
      columns: {
        name: true,
        description: true,
        headerPhoto: true,
        address: true,
        id: true,
        popupWhatsapp: true,
      },
      with: {
        owner: {
          columns: {
            avatar: true,
            phone: true,
          },
        },
      },
    });

    if (!data)
      return res.status(404).json({
        message: "Store not found",
        statusCode: 404,
      });

    const productsCount = await db.$count(
      ProductsTable,
      eq(ProductsTable.storeId, data.id)
    );

    const followersCount = await db.$count(
      FollowTable,
      eq(FollowTable.storeId, data.id)
    );

    return res.status(200).json({
      message: "Get detail store successfully",
      statusCode: 200,
      data: { ...data, productsCount, followersCount },
    });
  });
}
