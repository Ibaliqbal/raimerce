import { db } from "@/lib/db";
import { StoresTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function getStoreiD(currentUserID: string): Promise<string | undefined> {
  const getStoreId = await db.query.StoresTable.findFirst({
    where: eq(StoresTable.userId, currentUserID),
    columns: {
      id: true,
    },
  });

  if (!getStoreId) return undefined;

  return getStoreId.id;
}

export { getStoreiD };
