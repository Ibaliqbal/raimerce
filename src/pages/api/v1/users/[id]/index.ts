import { db } from "@/lib/db";
import { UsersTable } from "@/lib/db/schema";
import { updateProfileSchema } from "@/types/user";
import { ApiResponse } from "@/utils/api";
import { verify } from "@/utils/helper";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse & {
  data: any | null;
};

const acceptMethod = ["GET", "PUT"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!acceptMethod.includes(req.method as string)) {
    return res
      .status(405)
      .json({ message: "Method not allowed", statusCode: 405, data: null });
  }
  verify(req, res, async () => {
    const id = req.query.id;
    if (req.method === "PUT") {
      const body = req.body;
      const validation = updateProfileSchema.safeParse(body);

      if (!validation.success)
        return res
          .status(400)
          .json({ message: "Invalid data", statusCode: 400, data: null });

      // const data = await db
      //   .update(UsersTable)
      //   .set({
      //     updatedAt: sql`NOW()`,
      //     name: validation.data.name,
      //     phone: validation.data.phone,
      //   })
      //   .where(eq(UsersTable.id, id ? (id as string) : decoded.id))
      //   .returning({ name: UsersTable.name, phone: UsersTable.phone });
      return res.status(200).json({
        message: "Success update user",
        statusCode: 200,
        data: [],
      });
    }
    return res
      .status(200)
      .json({ message: "Success", statusCode: 200, data: [] });
  });
}
