import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/legacy/image";
import { StructuredText } from "react-datocms";
import Head from "next/head";
import { Carousel } from "react-responsive-carousel";
import { If } from "../../../components/If";
import { Locales, loadTranslation } from "../../../i18n";
import { datocms } from "../../../server/config";

export const config = {
  runtime: "experimental-edge"
};


export const getStaticPaths: GetStaticPaths = async () => {
  const { allGuides }: any = await datocms.request(`query GuidesIndex {
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

  const data: any = await datocms.request(GUIDE_QUERY, {
    slug: params.slug,
    locale,
    defaultLocale
  });

  return {
    notFound: data.guide === null,
    props: {
      translation: await loadTranslation(locale as Locales),
      ...data
    },
    revalidate: 15 * 60
  };
};

export default function Guide({ guide, allGuides: otherGuides }) {
  return (
    <main>
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
        className="prose prose-lg mx-auto my-8 px-4 prose-headings:font-heading"
        itemScope
        itemType="https://schema.org/Article"
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
              <img
                src={image.url}
                alt={image.alt}
                width={image.width}
                height={image.height}
                key={image.url}
                loading="lazy"
                decoding="async"
                draggable="false"
                className="select-none"
              />
            ))}
          </Carousel>
        </If>
      </article>
    </main>
  );
}
