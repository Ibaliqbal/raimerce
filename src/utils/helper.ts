import { TCart, TOrder, TProducts } from "@/lib/db/schema";
import { VariantSchemaT } from "@/types/product";
import { DiscountSchemaT } from "@/types/promo";

export function convertPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function templateOrderNotification(
  orderId: string,
  productName: string,
  type: "received" | "confirmed",
  toStore?: boolean
): string {
  if (toStore)
    return `✅ Notifikasi: Order dengan ID ${orderId} untuk produk "${productName}" telah dikonfirmasi.`;

  if (type === "confirmed")
    return `📦 Notifikasi: Order dengan ID ${orderId} untuk produk "${productName}" sedang diproses. Kami menghargai kepercayaan Anda kepada kami dan ingin memastikan bahwa pesanan Anda ditangani dengan baik. Terima kasih atas pesanan Anda! Jika produk sudah sampai silahkan komfirmasi.`;

  return `✅ Notifikasi: Order dengan ID ${orderId} untuk produk "${productName}" telah dikonfirmasi. Terima kasih atas pesanan Anda!.`;
}

export function templateViolationNotification(storeName: string): string {
  return `⚠️ Pemberitahuan: Kami menerima banyak masukan bahwa ada barang dari toko "${storeName}" yang sudah melanggar aturan. Kami sangat menghargai kerjasama Anda dalam menjaga kualitas dan integritas platform kami. Mohon segera periksa dan tindak lanjuti masalah ini untuk memastikan bahwa semua produk yang dijual mematuhi kebijakan yang telah ditetapkan. Terima kasih atas perhatian dan kerjasama Anda.`;
}

export function productReportTemplate(
  productName: string,
  productId: string,
  reportReason: string,
  additionalComments: string = ""
): string {
  return (
    `Laporan Produk: ${productName} (ID: ${productId})\n` +
    `Alasan Laporan: ${reportReason}\n` +
    `Komentar Tambahan: ${additionalComments}\n` +
    `Kami akan meninjau laporan ini dan mengambil tindakan yang diperlukan. Terima kasih atas perhatian Anda.`
  );
}

export function productViolationReport(
  productName: string,
  productId: string,
  violationDetails: string
): string {
  return (
    `Pemberitahuan Pelanggaran Produk: ${productName} (ID: ${productId})\n` +
    `Detail Pelanggaran: ${violationDetails}\n` +
    `Kami menghargai kerjasama Anda dalam menjaga kualitas produk di platform kami.`
  );
}

export function generateProductFeedbackReport(
  productName: string,
  productId: string,
  feedback: string
): string {
  return (
    `Laporan Umpan Balik Produk: ${productName} (ID: ${productId})\n` +
    `Umpan Balik: ${feedback}\n` +
    `Kami berterima kasih atas masukan Anda dan akan mempertimbangkan untuk perbaikan di masa mendatang.`
  );
}

export const choiceReportProduct = [
  "Produk ini ilegal dan melanggar kebijakan kami.",
  "Produk ini tidak sesuai dengan deskripsi yang diberikan.",
  "Produk ini mengandung bahan berbahaya.",
  "Produk ini telah dilaporkan sebagai barang palsu.",
  "Produk ini tidak memenuhi standar kualitas yang ditetapkan.",
  "Produk ini melanggar hak cipta atau merek dagang.",
  "Produk ini telah menerima banyak keluhan dari pengguna.",
  "Produk ini tidak memiliki izin yang diperlukan untuk dijual.",
  "Produk ini telah ditarik dari pasar karena masalah keamanan.",
  "Produk ini tidak sesuai dengan regulasi yang berlaku.",
];



export const calculateAfterDisc = (
  total: number,
  discPercentage: number
): number => {
  const discAmount = (total * discPercentage) / 100;
  const afterDisc = total - discAmount;
  return afterDisc;
};

export const convertDiscAmount = (
  total: number,
  discPercentage: number
): number => {
  return (total * discPercentage) / 100;
};

export const calculateProductTotal = (
  product: Pick<TCart, "variant" | "quantity" | "id" | "category"> & {
    product: Pick<TProducts, "name" | "id"> & {
      variant: VariantSchemaT | undefined;
    };
    subTotal: number;
  },
  discounts: Array<DiscountSchemaT>
) => {
  const discount = discounts.find(
    (disc) => disc.appliedTo === product.product.id
  );
  if (!discount) return product.subTotal;
  return calculateAfterDisc(product.subTotal, discount.amount);
};

export const calculateOrderSubtotal = (
  products: Array<
    Pick<TCart, "variant" | "quantity" | "id" | "category"> & {
      product: Pick<TProducts, "name" | "id"> & {
        variant: VariantSchemaT | undefined;
      };
      subTotal: number;
    }
  >,
  discounts: Array<DiscountSchemaT>
) => {
  return (
    products?.reduce(
      (acc, product) => acc + calculateProductTotal(product, discounts),
      0
    ) ?? 0
  );
};
export function calculateTotalWithPromo(
  products: Pick<TOrder, "products">,
  promos: Pick<TOrder, "promoCodes">
): number {
  const totalAfterDisc = products.products?.map((product) => {
    const { quantity, productVariant, productID } = product;
    const findRelevantPromo = promos.promoCodes?.find(
      (promo) => promo.appliedTo == productID
    )?.amount;
    const sum = quantity * (productVariant?.price || 0);
    const sumWithDisc = calculateAfterDisc(sum, findRelevantPromo || 0);

    return sumWithDisc;
  });

  return totalAfterDisc?.reduce((acc, curr) => acc + curr, 0) || 0;
}

export const groupDiscountsByCode = (discounts: Array<DiscountSchemaT>) => {
  return discounts.reduce((acc, curr) => {
    const existing = acc.find((item) => item.code === curr.code);
    if (existing) {
      existing.appliedTo.push(curr.appliedTo);
    } else {
      acc.push({
        code: curr.code,
        amount: curr.amount,
        appliedTo: [curr.appliedTo],
      });
    }
    return acc;
  }, [] as Array<{ code: string; amount: number; appliedTo: string[] }>);
};
