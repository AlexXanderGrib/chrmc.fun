import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { GraphQLClient } from "graphql-request";
import { StructuredText } from "react-datocms";
import Head from "next/head";
import nextI18NextConfig from "../../../next-i18next.config.js";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Carousel } from "react-responsive-carousel";
import { If } from "../../../components/If";

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
  const { allGuides } = await client.request(`query GuidesIndex {
    allGuides {
      slug,
      _allSeoLocales {
        locale
      }
    }
  }`);

  return {
    paths: allGuides.flatMap(({ _allSeoLocales, slug }) =>
      _allSeoLocales.map(({ locale }) => ({
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
  const client = initClient(preview);
  const GUIDE_QUERY = `query Guide($slug: String!, $locale: SiteLocale!, $defaultLocale: SiteLocale!) {
    
      allGuides(
        locale: $locale
        fallbackLocales: [$defaultLocale]
        first: 5
        filter: { slug: { neq: $slug } }
      ) {
        id
        title
        thumbnail {
          alt
          url
        }
      }
    
      guide(
        locale: $locale
        fallbackLocales: [$defaultLocale]
        filter: { slug: { eq: $slug } }
      ) {
        title
        slug

        seo {
          title
          description
          image {
            url
          }
        }
    
        thumbnail {
          width
          height
          url
        }
        content {
          value
        }
        images {
          url
          width
          height
          alt
        }
        video {
          thumbnailUrl
          provider
          width
          height
        }
      }
    
  }`;

  const data = await client.request(GUIDE_QUERY, {
    slug: params.slug,
    locale,
    defaultLocale
  });

  return {
    notFound: data.guide === null,
    props: {
      ...(await serverSideTranslations(
        locale,
        ["common", "footer", "nav"],
        nextI18NextConfig
      )),
      ...data
    },
    revalidate: 15 * 60
  };
};

export default function Guide({ guide, allGuides: otherGuides }) {
  return (
    <>
      <Head>
        <title>{guide.seo?.title ?? guide.title}</title>
        <meta name="og:title" content={guide.seo?.title ?? guide.title} />
        <meta name="description" content={guide.seo.description} />
        <meta
          property="og:image"
          content={guide.seo?.image?.url ?? guide.thumbnail.url}
        />
      </Head>

      <article
        className="prose prose-lg mx-auto my-8 px-4"
        itemScope
        itemType="https://schema.org/Article"
        itemProp="mainEntity"
      >
        <h1 className="break-words" itemProp="name">
          {guide.title}
        </h1>

        <Image
          src={guide.thumbnail.url}
          alt={guide.thumbnail.alt}
          width={guide.thumbnail.width}
          height={guide.thumbnail.height}
          priority
          className="-mx-4"
          itemProp="thumbnailUrl"
        />

        <div itemProp="articleBody">
          <StructuredText data={guide.content} />
        </div>

        <If condition={guide.images?.length > 0}>
          <Carousel showArrows={true} emulateTouch infiniteLoop>
            {guide.images.map((image) => (
              <Image
                src={image.url}
                alt={image.alt}
                width={image.width}
                height={image.height}
                key={image.url}
              />
            ))}
          </Carousel>
        </If>
      </article>
    </>
  );
}
