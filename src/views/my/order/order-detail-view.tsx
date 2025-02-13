import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoMdDownload } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TOrder, TUser } from "@/lib/db/schema";
import { format } from "date-fns";
import {
  calculateAfterDisc,
  calculateTotalWithPromo,
  convertPrice,
  groupDiscountsByCode,
} from "@/utils/helper";
import { fee } from "@/utils/constant";

type Props = {
  order: Pick<
    TOrder,
    "status" | "createdAt" | "products" | "transactionCode" | "promoCodes"
  > & {
    user: Pick<TUser, "email" | "name" | "phone"> | null;
  };
};

const OrderDetailView = ({ order }: Props) => {
  const subTotal =
    order.products?.reduce(
      (acc, curr) => acc + (curr.productVariant?.price || 0) * curr.quantity,
      0
    ) || 0;
  return (
    <div className="wrapper-page px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Detail Pesanan #{order.transactionCode}
      </h1>

      <div className="md:grid flex flex-col md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2 shadow-md">
          <Card.Description asLink={false}>
            <h2 className="text-xl font-semibold mb-2">Informasi Pesanan</h2>
            <p className="mb-4">Detail pesanan dan status</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Payment Status :</span>
              <Badge variant={order.status || "pending"}>
                {(order.status || "pending").charAt(0).toUpperCase() +
                  (order.status || "pending").slice(1)}
              </Badge>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p>
                <strong>Pelanggan : </strong> {order.user?.name}
              </p>
              <p>
                <strong>Email : </strong> {order.user?.email}
              </p>
              <p>
                <strong>Phone : </strong>{" "}
                {order.user?.phone ? order.user.phone : "-"}
              </p>
              <p>
                <strong>Tanggal Pesanan : </strong>{" "}
                {format(new Date(order.createdAt as Date), "dd MMMM, yyyy")}
              </p>
            </div>
          </Card.Description>
        </Card>

        <Card className="shadow-md">
          <Card.Description asLink={false}>
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pembayaran</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal : </span>
                <span>{convertPrice(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Promo : </span>
                {order.promoCodes?.length ?? 0 > 0 ? (
                  <div className="flex flex-col gap-3 items-end">
                    {groupDiscountsByCode(order.promoCodes || []).map(
                      (promo) => (
                        <span key={promo.code}>
                          {promo.amount}% ({promo.code})
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <span>-</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Pajak : </span>
                <span>{convertPrice(fee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {convertPrice(
                    calculateTotalWithPromo(
                      { products: order.products },
                      { promoCodes: order.promoCodes }
                    ) + fee
                  )}
                </span>
              </div>
            </div>
          </Card.Description>
        </Card>
      </div>

      <div className="shadow-md overflow-hidden">
        <Card.Description asLink={false}>
          <h2 className="text-2xl font-bold mb-4">Item Pesanan</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Produk</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Harga per Unit</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products?.map((item) => {
                const findRelevantPromo = order.promoCodes?.find(
                  (promo) => promo.appliedTo === item.productID
                );
                return (
                  <TableRow key={item.variant}>
                    <TableCell className="font-medium">{`${item.productName} (${item.variant})`}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {convertPrice(item.productVariant?.price || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {findRelevantPromo ? (
                        <div className="flex flex-col items-end">
                          <span className="font-semibold">
                            {convertPrice(
                              calculateAfterDisc(
                                (item.productVariant?.price || 0) *
                                  item.quantity,
                                findRelevantPromo.amount
                              )
                            )}
                          </span>
                          <span className="text-xs text-red-500 line-through">
                            {convertPrice(
                              (item.productVariant?.price || 0) * item.quantity
                            )}
                          </span>
                        </div>
                      ) : (
                        convertPrice(
                          (item.productVariant?.price || 0) * item.quantity
                        )
                      )}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        item.status === "received"
                          ? "text-green-500"
                          : item.status === "confirmed"
                          ? "text-blue-400"
                          : "text-red-500"
                      } font-bold`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1).split("-").join(" ")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card.Description>
      </div>

      <Button
        className="mt-6 flex gap-2"
        variant="primary"
        size="lg"
        onClick={() => window.print()}
      >
        <IoMdDownload className="text-lg" />
        Download
      </Button>
    </div>
  );
};

export default OrderDetailView;
