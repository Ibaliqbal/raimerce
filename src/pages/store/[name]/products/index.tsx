import Popupwhatsapp from "@/components/popup-whatsapp";
import StoreLayout from "@/layouts/store-layout";
import instance from "@/lib/axios/instance";
import { TStore, TUser } from "@/lib/db/schema";
import StoreProductsView from "@/views/store/store-products-view";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

type Props = Pick<
  TStore,
  "address" | "name" | "headerPhoto" | "description" | "id" | "popupWhatsapp"
> & {
  productsCount: number;
  followersCount: number;
  owner: Pick<TUser, "avatar" | "phone">;
};

// fetching in server side

export const getServerSideProps = (async ({ params }) => {
  const { data } = await instance.get(`/stores/${params?.name}`);
  const store = data.data as Props;
  return {
    props: {
      data: store,
    },
  };
}) satisfies GetServerSideProps<{
  data: Props;
}>;

const Page = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <StoreLayout
      title={`Produk Toko-${data.name} - Raimerce`}
      descriptionWeb="Jelajahi berbagai produk yang ditawarkan oleh toko ini di Raimerce. Temukan pilihan produk berkualitas dengan harga terbaik dan nikmati pengalaman belanja yang menyenangkan."
      keyword={[
        "produk toko",
        "Raimerce",
        "daftar produk",
        "belanja online",
        "produk berkualitas",
        "harga terbaik",
      ]}
      {...data}
    >
      <StoreProductsView />
      {data.popupWhatsapp && (
        <Popupwhatsapp phoneNumber={(data.owner.phone as string) ?? ""} />
      )}
    </StoreLayout>
  );
};

export default Page;
