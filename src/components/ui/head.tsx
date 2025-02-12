import NextHead from "next/head";

type Props = {
  title: string;
  keyword?: string[];
  description?: string;
  site: string;
};

const Head = ({ title, keyword, description, site }: Props) => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="og:title" content={title} />
      {description && <meta name="description" content={description} />}
      {keyword && <meta name="og:keyword" content={keyword.toString()} />}
      {description && <meta name="og:description" content={description} />}
      <meta
        name="og:url"
        content={`${process.env.NEXT_PUBLIC_APP_URL}${site}`}
      />
    </NextHead>
  );
};

export default Head;
