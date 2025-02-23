import Popupwhatsapp from "@/components/popup-whatsapp";
import StoreLayout from "@/layouts/store-layout";
import instance from "@/lib/axios/instance";
import { TStore, TUser } from "@/lib/db/schema";
import StoreNewsView from "@/views/store/store-news-view";
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
      title={`Berita Toko-${data.name} - Raimerce`}
      descriptionWeb="Temukan berita terbaru dan informasi penting dari toko Anda di Raimerce. Dapatkan update tentang produk baru, penawaran khusus, dan acara yang akan datang untuk tetap terhubung dengan pelanggan Anda."
      keyword={[
        "berita toko",
        "Raimerce",
        "informasi toko",
        "update produk",
        "penawaran khusus",
        "acara toko",
      ]}
      {...data}
    >
      <StoreNewsView />
      {data.popupWhatsapp && (
        <Popupwhatsapp phoneNumber={(data.owner.phone as string) ?? ""} />
      )}
    </StoreLayout>
  );
};

export default Page;
