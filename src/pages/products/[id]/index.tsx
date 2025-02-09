import BaseLayout from "@/layouts/base-layout";
import instance from "@/lib/axios/instance";
import { TComment, TProducts, TStore, TUser } from "@/lib/db/schema";
import ProductsDetailView from "@/views/products/detail/products-detail-view";
import ProductsSimilarView from "@/views/products/detail/products-similar-view";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

type Props = Pick<
  TProducts,
  "id" | "description" | "name" | "rating" | "variant" | "storeId" | "category"
> & {
  productsCount: number;
  followersCount: number;
  store: Pick<TStore, "name" | "id"> | null;
  comments: Array<
    Pick<
      TComment,
      "content" | "createdAt" | "id" | "medias" | "rating" | "variant"
    > & {
      user: Pick<TUser, "name"> | null;
    }
  >;
};

// fetching in server side

export const getServerSideProps = (async ({ params, query }) => {
  const { data } = await instance.get(`/products/${params?.id}`);
  const product = data.data as Props;
  return {
    props: {
      data: product,
      selectedVariant: query.variant as string,
    },
  };
}) satisfies GetServerSideProps<{
  data: Props;
  selectedVariant: string;
}>;

const Page = ({
  data,
  selectedVariant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <BaseLayout>
      <main className="flex flex-col gap-5 container xl:max-w-[1400px] max-w-7xl p-4 pb-10">
        <ProductsDetailView
          {...data}
          selectedVariant={selectedVariant}
          key={selectedVariant}
        />
        <ProductsSimilarView id={data.id} />
      </main>
    </BaseLayout>
  );
};

export default Page;
