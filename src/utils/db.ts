import { db } from "@/lib/db";
import { StoresTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function getStoreID(currentUserID: string): Promise<string | undefined> {
  const getStoreID = await db.query.StoresTable.findFirst({
    where: eq(StoresTable.userId, currentUserID),
    columns: {
      id: true,
    },
  });

  if (!getStoreID) return undefined;

  return getStoreID.id;
}

export { getStoreID };
