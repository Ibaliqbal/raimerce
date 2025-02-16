import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { TUser, UsersTable } from "@/lib/db/schema";
import { and, gte, ne } from "drizzle-orm";
import { addDays } from "date-fns";

type Data = ApiResponse & {
  data?: Array<TUser>;
  totalUsers?: number;
  newUsers?: number;
  activeUsers?: number;
};

const acceptMethods = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, async () => {
    const _type = req.query.type as string;

    if (_type === "users_summary") {
      const users = await db.query.UsersTable.findMany({
        where: ne(UsersTable.role, "admin"),
        columns: {
          nonActive: true,
        },
      });

      const newUsers = await db.$count(
        UsersTable,
        and(
          gte(UsersTable.createdAt, addDays(new Date(), -7)),
          ne(UsersTable.role, "admin")
        )
      );

      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        totalUsers: users.length,
        newUsers,
        activeUsers: users.filter((user) => !user.nonActive).length,
      });
    }

    const data = await db.query.UsersTable.findMany();

    return res.status(200).json({
      message: "Success",
      statusCode: 200,
      data,
    });
  });
}
