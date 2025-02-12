import StoreLayout from "@/layouts/store-layout";
import instance from "@/lib/axios/instance";
import { TStore } from "@/lib/db/schema";
import StoreProductsView from "@/views/store/store-products-view";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

type Props = Pick<
  TStore,
  "address" | "name" | "headerPhoto" | "description" | "id"
> & {
  productsCount: number;
  followersCount: number;
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
    </StoreLayout>
  );
};

export default Page;
