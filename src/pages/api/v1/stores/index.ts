import { db } from "@/lib/db";
import { StoresTable, UsersTable } from "@/lib/db/schema";
import { secureMethods, verify } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import { gettingStartedSchema } from "@/types/store";
import { ApiResponse } from "@/utils/api";
import { eq } from "drizzle-orm";

type Data = ApiResponse;

const acceptMethod = ["POST"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;

      if (req.method === "POST") {
        const body = req.body;
        const validation = gettingStartedSchema.safeParse(body);

        const getAddress = await db.query.UsersTable.findFirst({
          where: eq(UsersTable.id, decoded.id),
          columns: {
            address: true,
            phone: true,
          },
        });

        if (!validation.success)
          return res
            .status(400)
            .json({ message: "Invalid data", statusCode: 400 });

        if (!getAddress?.address || !getAddress.phone)
          return res.status(400).json({
            message: "Please fill your information first...",
            statusCode: 400,
          });

        await db.insert(StoresTable).values({
          name: validation.data.name,
          description: validation.data.description,
          userId: decoded.id,
          headerPhoto: validation.data.headerPhoto,
          address: getAddress?.address,
        });

        return res
          .status(201)
          .json({ message: "Store created successfully!", statusCode: 201 });
      }
    });
  });
}
