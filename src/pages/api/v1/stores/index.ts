import { db } from "@/lib/db";
import { StoresTable } from "@/lib/db/schema";
import { verify } from "@/utils/helper";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import { gettingStartedSchema } from "@/types/store";
import { ApiResponse } from "@/utils/api";

type Data = ApiResponse;

const acceptMethod = ["POST"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!acceptMethod.includes(req.method as string)) {
    return res
      .status(405)
      .json({ message: "Method not allowed", statusCode: 405 });
  }

  verify(req, res, async (decode) => {
    const decoded = decode as JWT;

    if (req.method === "POST") {
      const body = req.body;
      const validation = gettingStartedSchema.safeParse(body);

      if (!validation.success)
        return res
          .status(400)
          .json({ message: "Invalid data", statusCode: 400 });

      await db.insert(StoresTable).values({
        name: validation.data.name,
        description: validation.data.description,
        userId: decoded.id,
      });

      return res
        .status(201)
        .json({ message: "Store created successfully!", statusCode: 201 });
    }
  });
}
