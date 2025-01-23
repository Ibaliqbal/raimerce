import BaseLayout from "@/layouts/base-layout";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import StoreProductUpdateView from "@/views/my/store/products/store-update-product-view";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

// fetching in server side

type Props = Pick<
  TProducts,
  "category" | "description" | "id" | "name" | "variant"
>;

export const getServerSideProps = (async ({ query }) => {
  const id = query.id;
  const res = await instance.get(`/users/login/store/products/${id}`);
  const data = res.data.data as Props;
  return {
    props: {
      data,
    },
  };
}) satisfies GetServerSideProps<{
  data: Props;
}>;

const Page = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <BaseLayout>
      <StoreProductUpdateView data={data} />
    </BaseLayout>
  );
};

export default Page;
