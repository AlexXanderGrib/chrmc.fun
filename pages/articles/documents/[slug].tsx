import { GetStaticPaths, GetStaticProps } from "next";
import { StructuredText } from "react-datocms";
import Head from "next/head";
import { Locales, loadTranslation, useTranslation } from "../../../i18n";
import { datocms } from "../../../server/config";

export const config = {
  runtime: "experimental-edge"
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { allDocuments }: any = await datocms.request(`query DocumentsIndex {
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

  const GUIDE_QUERY = `query Document($slug: String!, $locale: SiteLocale!, $defaultLocale: SiteLocale!) {
      document(
        locale: $locale
        fallbackLocales: [$defaultLocale]
        filter: { slug: { eq: $slug } }
      ) {
        title
        slug
        updatedAt

        content {
          value
        }
      }
  }`;

  const data: any = await datocms.request(GUIDE_QUERY, {
    slug: params.slug,
    locale,
    defaultLocale
  });

  return {
    notFound: data.document === null,
    props: {
      translation: await loadTranslation(locale as Locales),
      document:
        data.document === null
          ? null
          : {
              ...data.document,
              updatedAt: {
                pure: data.document.updatedAt,
                formatted: formatter.format(new Date(data.document.updatedAt))
              }
            }
    },
    revalidate: 15 * 60
  };
};

export default function Document({ document }) {
  const t = useTranslation()["article"];
  return (
    <main>
      <Head>
        <title>{document.title}</title>
      </Head>

      <article
        className="prose prose-lg mx-auto my-8 px-2 prose-headings:font-heading"
        itemScope
        itemType="https://schema.org/Article"
      >
        <h1 className="break-words" itemProp="name">
          {document.title}
        </h1>
        <time dateTime={document.updatedAt.pure} itemProp="dateModified">
          {t.updatedAt} {document.updatedAt.formatted}
        </time>
        <div itemProp="articleBody">
          <StructuredText data={document.content} />
        </div>
      </article>
    </main>
  );
}
