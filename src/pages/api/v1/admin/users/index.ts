import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { UsersTable } from "@/lib/db/schema";
import { ne } from "drizzle-orm";

type Data = ApiResponse & {
  data?: any;
  totalUsers?: number;
};

const acceptMethods = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, async () => {
    const _type = req.query.type as string;

    if (_type === "total_users") {
      const totalUsers = await db.$count(
        UsersTable,
        ne(UsersTable.role, "admin")
      );
      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        totalUsers,
      });
    }

    return res.status(200).json({
      message: "Success",
      statusCode: 200,
    });
  });
}
