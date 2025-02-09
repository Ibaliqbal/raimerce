import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { db } from "@/lib/db";
import { OrdersTable, ProductsTable } from "@/lib/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { groupOrderByProduct } from "@/utils/helper";

type Data = {
  status: boolean;
  message: string;
};

const acceptMethod = ["POST"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!acceptMethod.includes(req.method as string)) {
    return res
      .status(405)
      .json({ message: "Method not allowed", status: false });
  }
  const body = await req.body;
  let fraudStatus = "";
  let transactionStatus = "";
  let orderId = "";
  const hash = crypto
    .createHash("sha512")
    .update(
      `${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`
    )
    .digest("hex");

  if (body.signature_key !== hash)
    return res.status(403).json({
      status: false,
      message: "Invalid Signature",
    });

  transactionStatus = body.transaction_status;
  fraudStatus = body.fraud_status;
  orderId = body.order_id;

  console.log(body);
  console.log(orderId);

  if (transactionStatus == "capture") {
    if (fraudStatus == "accept") {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK

      // await db
      //   .update(OrdersTable)
      //   .set({
      //     updatedAt: sql`NOW()`,
      //     status: "success",
      //   })
      //   .where(eq(OrdersTable.transactionCode, orderId));

      return res.status(200).json({
        status: true,
        message: "OK",
      });
    }
  } else if (transactionStatus == "settlement") {
    // TODO set transaction status on your database to 'success'
    // and response with 200 OK

    // await db
    //   .update(OrdersTable)
    //   .set({
    //     updatedAt: sql`NOW()`,
    //     status: "success",
    //   })
    //   .where(eq(OrdersTable.transactionCode, orderId));

    return res.status(200).json({
      status: true,
      message: "OK",
    });
  } else if (
    transactionStatus == "cancel" ||
    transactionStatus == "deny" ||
    transactionStatus == "expire"
  ) {
    // TODO set transaction status on your database to 'failure'
    // and response with 200 OK

    // const detailOrder = await db.query.OrdersTable.findFirst({
    //   where: eq(OrdersTable.transactionCode, orderId),
    //   columns: {
    //     products: true,
    //     promoCodes: true,
    //     productsID: true,
    //   },
    // });

    // await db
    //   .update(OrdersTable)
    //   .set({
    //     updatedAt: sql`NOW()`,
    //     status: "canceled",
    //   })
    //   .where(eq(OrdersTable.transactionCode, orderId));

    // if (!detailOrder)
    //   return res.status(200).json({
    //     status: true,
    //     message: "OK",
    //   });

    // const products = await db.query.ProductsTable.findMany({
    //   where: inArray(OrdersTable.id, detailOrder.productsID as string[]),
    //   columns: {
    //     id: true,
    //     variant: true,
    //     soldout: true,
    //   },
    // });

    // const updateProducts = async () => {
    //   for (const product of products) {
    //     const filteredById = groupOrderByProduct({
    //       products: detailOrder.products,
    //     }).find((order) => order.productID === product.id);

    //     const variantProductUpdate = product.variant.map((variant) => {
    //       const findSameVariant = filteredById?.variant.find(
    //         (v) => v.name_variant === variant.name_variant
    //       );

    //       if (findSameVariant) {
    //         return {
    //           ...variant,
    //           stock: variant.stock - findSameVariant.quantity,
    //         };
    //       } else {
    //         return variant;
    //       }
    //     });

    //     await db
    //       .update(ProductsTable)
    //       .set({
    //         variant: variantProductUpdate,
    //         updatedAt: sql`NOW()`,
    //         soldout: product.soldout - (filteredById?.sumSoldout ?? 0),
    //       })
    //       .where(eq(ProductsTable.id, product.id));
    //   }
    // };

    // await Promise.all([updateProducts()]);

    return res.status(200).json({
      status: true,
      message: "OK",
    });
  } else if (transactionStatus == "pending") {
    // TODO set transaction status on your database to 'pending' / waiting payment
    // and response with 200 OK

    // await db
    //   .update(OrdersTable)
    //   .set({
    //     updatedAt: sql`NOW()`,
    //     status: "pending",
    //   })
    //   .where(eq(OrdersTable.transactionCode, orderId));

    return res.status(200).json({
      status: true,
      message: "OK",
    });
  }
}
