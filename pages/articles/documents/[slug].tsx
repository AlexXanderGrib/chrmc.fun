import { GetStaticPaths, GetStaticProps } from "next";
import { GraphQLClient } from "graphql-request";
import { StructuredText } from "react-datocms";
import Head from "next/head";
import nextI18NextConfig from "../../../next-i18next.config.js";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

let client: GraphQLClient;

function initClient(preview = false) {
  return (client ??= new GraphQLClient(
    preview
      ? `https://graphql.datocms.com/preview`
      : `https://graphql.datocms.com/`,
    {
      headers: {
        authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}`
      }
    }
  ));
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = initClient();
  const { allDocuments } = await client.request(`query DocumentsIndex {
    allDocuments {
      slug,
      _allContentLocales {
        locale
      }
    }
  }`);

  return {
    paths: allDocuments.flatMap(({ _allContentLocales, slug }) =>
      _allContentLocales.map(({ locale }) => ({
        locale,
        params: { slug }
      }))
    ),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({
  locale,
  defaultLocale,
  params,
  preview
}) => {
  const formatter = new Intl.DateTimeFormat([locale, defaultLocale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short"
  });

  const client = initClient(preview);
  const GUIDE_QUERY = `query Document($slug: String!, $locale: SiteLocale!, $defaultLocale: SiteLocale!) {
      document(
        locale: $locale
        fallbackLocales: [$defaultLocale]
        filter: { slug: { eq: $slug } }
      ) {
        title
        slug
        _updatedAt

        content {
          value
        }
      }
  }`;

  const data = await client.request(GUIDE_QUERY, {
    slug: params.slug,
    locale,
    defaultLocale
  });

  return {
    notFound: data.document === null,
    props: {
      ...(await serverSideTranslations(
        locale,
        ["common", "footer", "nav", "article"],
        nextI18NextConfig
      )),
      document:
        data.document === null
          ? null
          : {
              ...data.document,
              updatedAt: {
                pure: data.document._updatedAt,
                formatted: formatter.format(new Date(data.document._updatedAt))
              }
            }
    },
    revalidate: 15 * 60
  };
};

export default function Document({ document }) {
  const { t } = useTranslation("article");
  return (
    <main itemProp="mainEntity">
      <Head>
        <title>{document.title}</title>
      </Head>

      <article
        className="prose prose-lg mx-auto my-8 px-2"
        itemScope
        itemType="https://schema.org/Article"
      >
        <h1 className="break-words" itemProp="name">
          {document.title}
        </h1>
        <time dateTime={document.updatedAt.pure} itemProp="dateModified">
          {t("updatedAt")} {document.updatedAt.formatted}
        </time>
        <div itemProp="articleBody">
          <StructuredText data={document.content} />
        </div>
      </article>
    </main>
  );
}
