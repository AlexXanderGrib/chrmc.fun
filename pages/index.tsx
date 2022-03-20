import Head from "next/head";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
import { ComponentProps, FC, ReactNode, useEffect, useState } from "react";
import { If } from "../components/If";
import {
  ClipboardCopyIcon,
  DesktopComputerIcon,
  DeviceMobileIcon,
  ExternalLinkIcon,
  GlobeAltIcon
} from "@heroicons/react/solid";
import Link from "../components/Link";
import { GraphQLClient } from "graphql-request";
import { GetStaticProps } from "next";

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

export const getStaticProps: GetStaticProps = async ({
  locale,
  defaultLocale
}) => {
  const client = initClient();
  const ADV_QUERY = `query AdvantageQuery($locale: SiteLocale!, $defaultLocale: SiteLocale!) {
    allAdvantages(
      locale: $locale
      fallbackLocales: [$defaultLocale]

    ) {
      title
      content
      id
      icon {
        url
      }
    }
  }`;

  const data = await client.request(ADV_QUERY, {
    locale,
    defaultLocale
  });

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["index", "common", "footer", "nav"],
        nextI18NextConfig
      )),
      data
    }
  };
};
type PlayerPlatform = "java" | "bedrock" | "consoles";

function ScrollSpy({ children }: { children: (pos: number) => ReactNode }) {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    let stopped = false;
    let frame = 0;

    const update = () => setPos(Math.floor(window.scrollY / 1.3));

    function tick() {
      update();

      if (!stopped) frame = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
    };
  }, [setPos]);

  return <>{children(pos)}</>;
}

export default function Home({ data }) {
  const { t: tc } = useTranslation("common");
  const { t } = useTranslation("index");
  const [primaryPlatform, setPrimaryPlatform] = useState<
    PlayerPlatform | undefined
  >(undefined);

  useEffect(() => {
    const map: Record<string, PlayerPlatform> = {
      iPhone: "bedrock",
      iPad: "bedrock",
      Xbox: "consoles",
      PlayStation: "consoles",
      "Nintendo Switch": "consoles",
      Android: "bedrock",
      "Mac OS X": "java",
      X11: "java",
      Wayland: "java",
      "Windows NT 6": "java",
      Mobile: "bedrock"
    };

    for (const key in map) {
      if (navigator.userAgent.includes(key)) {
        setPrimaryPlatform(map[key]);
        break;
      }
    }
  }, [setPrimaryPlatform]);

  const platforms: Record<
    PlayerPlatform,
    [destination: string, icon: FC<ComponentProps<"svg">>]
  > = {
    java: [
      "/articles/guides/how-to-join-from-java-edition",
      DesktopComputerIcon
    ],
    bedrock: ["/articles/guides/how-to-join-from-bedrock", DeviceMobileIcon],
    consoles: ["/articles/guides/how-to-join-from-consoles", GlobeAltIcon]
  };

  return (
    <>
      <Head>
        <meta name="description" content={tc("seo.description")} />
        <meta name="keywords" content={tc("seo.keywords")} />
        <meta name="og:title" content={tc("seo.title")} />

        <title>{tc("seo.title")}</title>
        <meta property="og:image" content="/hero@1x.jpg" />
      </Head>
      <div className="relative min-h-[500px] h-[90vh] max-h-[1200px] w-full overflow-hidden">
        <ScrollSpy>
          {(pos) => (
            <picture>
              <source
                srcSet="/images/pictures/hero@1x.avif, /images/pictures/hero@2x.avif 2x"
                type="image/avif"
              />
              <source
                srcSet="/images/pictures/hero@1x.webp, /images/pictures/hero@2x.webp 2x"
                type="image/webp"
              />
              <img
                src="/images/pictures/hero@1x.jpg"
                srcSet="/images/pictures/hero@2x.jpg 2x"
                className="absolute w-full h-full top-0 left-0 object-cover object-center select-none -z-10 will-change-transform"
                loading="eager"
                decoding="async"
                draggable="false"
                alt=""
                style={{
                  transform: `translateY(${Math.max(0, pos - 60)}px) scale(${
                    1 + Math.max(0, pos - 60) / 3500
                  })`
                }}
              />
            </picture>
          )}
        </ScrollSpy>

        <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent opacity-60" />
        <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-between items-center">
          <div className="pt-8 text-center text-white" />
          <div className="max-w-lg px-4">
            <hgroup className="text-white text-center flex flex-col gap-4">
              <h1 className="text-3xl font-bold" itemProp="name">
                {tc("seo.title")}
              </h1>
              <p itemProp="description">{tc("seo.description")}</p>
            </hgroup>

            <div className="pt-8">
              <If condition={primaryPlatform === "java"}>
                <form
                  className="grid gap-y-2 grid-cols-[auto_6rem_4rem] grid-rows-[auto_4rem] w-full"
                  onSubmit={(e) => {
                    e.preventDefault();

                    navigator.clipboard.writeText(
                      `${tc("server.ip")}:${tc("server.javaPort")}`
                    );
                  }}
                >
                  <label htmlFor="address" className="text-white font-bold">
                    {tc("join.address")}
                  </label>
                  <label htmlFor="port" className="text-white font-bold">
                    {tc("join.port")}
                  </label>
                  <span />
                  <input
                    type="text"
                    id="address"
                    readOnly
                    value={tc("server.ip") as string}
                    className="rounded-l px-2 w-full"
                  />
                  <input
                    type="number"
                    id="port"
                    readOnly
                    value={tc("server.javaPort") as string}
                    className="text-center"
                  />
                  <button
                    className="clickable bg-action-500 hover:bg-action-600 transition-colors text-white w-full h-16 flex items-center justify-center rounded-r font-bold"
                    title={tc("join.actions.copy")}
                  >
                    <ClipboardCopyIcon
                      className="w-6 h-6"
                      aria-label={tc("join.actions.copy")}
                    />
                  </button>
                </form>
              </If>

              <If condition={primaryPlatform === "bedrock"}>
                <a
                  className="clickable bg-action-500 hover:bg-action-600 transition-colors text-white w-full h-16 flex items-center justify-center rounded font-bold"
                  href={`minecraft://?addExternalServer=${tc(
                    "server.name"
                  )}|${tc("server.ip")}:${tc("server.bedrockPort")}`}
                  draggable="false"
                >
                  {tc("join.actions.bedrock-join")}
                </a>
              </If>

              <If
                condition={
                  primaryPlatform === undefined ||
                  primaryPlatform === "consoles"
                }
              >
                <a
                  className="clickable bg-action-500 hover:bg-action-600 transition-colors text-white w-full h-16 flex items-center justify-center rounded font-bold"
                  href="#join"
                  draggable="false"
                >
                  {tc("join.actions.how-to-join")}
                </a>
              </If>
            </div>
          </div>
          <div className="w-full">
            <div className="text-center pb-4">
              <a
                href="#join"
                className="
                clickable
                mx-auto
                rounded-full
                w-12
                h-12
                flex
                items-center
                justify-center
                text-white
              "
                aria-label="Scroll down"
                lang="en"
                draggable="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 1920 180"
            >
              <path
                className="fill-primary-600"
                fillRule="evenodd"
                d="M0 44.902l40 18.742c40 18.742 120 56.226 200 64.035 80 7.419 160-15.228 240-33.97 80-18.742 160-33.579 240-44.902s160-18.742 240-7.419c80 11.324 160 40.998 240 33.58 80-7.42 160-52.322 240-63.645s160 11.323 240 14.837c80 3.905 160-10.932 200-18.741L1920 0v180H0V44.902z"
                clipRule="evenodd"
                opacity=".5"
              />
              <path
                className="fill-primary-400"
                fillRule="evenodd"
                d="M0 95.564l46-4.637c45-4.636 137-13.91 228-4.636 92 9.273 183 37.581 275 46.854 91 9.274 182 0 274-9.273 91-9.517 183-18.791 274-30.504 92-11.714 183-25.868 274-25.868 92 0 183 14.154 275 28.064 91 14.154 183 28.308 228 35.141l46 7.077V180H0V95.564z"
                clipRule="evenodd"
                opacity=".5"
              />
              <path
                className="fill-primary-50"
                fillRule="evenodd"
                d="M0 140.02l29 6.605c29 6.605 87 19.99 146 11.646 58-8.343 116-38.416 174-39.98 58-1.738 116 25.031 175 31.637 58 6.779 116-6.606 174-9.908 58-3.477 117 3.302 175 8.343 58 4.867 116 8.344 174 4.867 58-3.302 117-13.21 175-26.595 58-13.385 116-30.073 174-30.073 59 0 117 16.688 175 26.77 58 9.908 116 13.211 174 14.949 59 1.739 117 1.739 146 1.739h29V180H0v-39.98z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <main className="">
        <div className="pt-8 bg-primary-50">
          <section className="prose prose-primary mx-auto p-2 my-4">
            <h2 id="join" className="text-center">
              {tc("join.actions.how-to-join")}
            </h2>

            <div className="flex flex-col gap-4">
              {Object.keys(platforms).map((value) => {
                const [href, Icon] = platforms[value];

                return (
                  <Link
                    key={value}
                    href={href}
                    className="flex clickable items-center w-full gap-2 px-6 py-4 text-sm font-medium text-left text-primary-900 bg-primary-100 rounded-lg hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 transition-colors"
                  >
                    <div className="flex bg-primary-200 rounded-full w-12 h-12 items-center justify-center p-6 relative">
                      <Icon className="w-6 h-6 absolute" />
                    </div>

                    <div className="whitespace-nowrap">
                      {tc(`guides.${value}.title`)}
                    </div>

                    <div className="w-full" />
                    <ExternalLinkIcon className="w-6 h-6" />
                  </Link>
                );
              })}
            </div>
          </section>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1920 180"
          >
            <path
              className="fill-emerald-600"
              fillRule="evenodd"
              d="M0 44.902l40 18.742c40 18.742 120 56.226 200 64.035 80 7.419 160-15.228 240-33.97 80-18.742 160-33.579 240-44.902s160-18.742 240-7.419c80 11.324 160 40.998 240 33.58 80-7.42 160-52.322 240-63.645s160 11.323 240 14.837c80 3.905 160-10.932 200-18.741L1920 0v180H0V44.902z"
              clipRule="evenodd"
              opacity=".5"
            />
            <path
              className="fill-emerald-400"
              fillRule="evenodd"
              d="M0 95.564l46-4.637c45-4.636 137-13.91 228-4.636 92 9.273 183 37.581 275 46.854 91 9.274 182 0 274-9.273 91-9.517 183-18.791 274-30.504 92-11.714 183-25.868 274-25.868 92 0 183 14.154 275 28.064 91 14.154 183 28.308 228 35.141l46 7.077V180H0V95.564z"
              clipRule="evenodd"
              opacity=".5"
            />
            <path
              className="fill-emerald-100"
              fillRule="evenodd"
              d="M0 140.02l29 6.605c29 6.605 87 19.99 146 11.646 58-8.343 116-38.416 174-39.98 58-1.738 116 25.031 175 31.637 58 6.779 116-6.606 174-9.908 58-3.477 117 3.302 175 8.343 58 4.867 116 8.344 174 4.867 58-3.302 117-13.21 175-26.595 58-13.385 116-30.073 174-30.073 59 0 117 16.688 175 26.77 58 9.908 116 13.211 174 14.949 59 1.739 117 1.739 146 1.739h29V180H0v-39.98z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="bg-emerald-100">
          <section className="prose max-w-5xl prose-emerald mx-auto p-2">
            <h2 className="text-center">{t("advantages")}</h2>

            <div className="not-prose">
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                {data.allAdvantages.map((adv) => (
                  <li className="p-2" key={adv.id}>
                    <article className="border border-emerald-200 border-opacity-75 p-6 rounded-lg bg-emerald-50">
                      <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-emerald-200 text-indigo-400 mb-4">
                        <img
                          src={adv.icon.url}
                          alt=""
                          className="select-none pixelated"
                          draggable="false"
                          loading="eager"
                          width={32}
                          height={32}
                        
                        />
                      </div>
                      <h3 className="text-lg text-emerald-900 font-medium title-font mb-2">
                        {adv.title}
                      </h3>
                      <p className="leading-relaxed text-base line-clamp-3">
                        {adv.content}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1920 180"
          >
            <path
              className="fill-[#5865F2]"
              fillRule="evenodd"
              d="M0 44.902l40 18.742c40 18.742 120 56.226 200 64.035 80 7.419 160-15.228 240-33.97 80-18.742 160-33.579 240-44.902s160-18.742 240-7.419c80 11.324 160 40.998 240 33.58 80-7.42 160-52.322 240-63.645s160 11.323 240 14.837c80 3.905 160-10.932 200-18.741L1920 0v180H0V44.902z"
              clipRule="evenodd"
              opacity=".5"
            />
            <path
              className="fill-[#5865F2]"
              fillRule="evenodd"
              d="M0 95.564l46-4.637c45-4.636 137-13.91 228-4.636 92 9.273 183 37.581 275 46.854 91 9.274 182 0 274-9.273 91-9.517 183-18.791 274-30.504 92-11.714 183-25.868 274-25.868 92 0 183 14.154 275 28.064 91 14.154 183 28.308 228 35.141l46 7.077V180H0V95.564z"
              clipRule="evenodd"
              opacity=".5"
            />
            <path
              className="fill-[#5865F2]"
              fillRule="evenodd"
              d="M0 140.02l29 6.605c29 6.605 87 19.99 146 11.646 58-8.343 116-38.416 174-39.98 58-1.738 116 25.031 175 31.637 58 6.779 116-6.606 174-9.908 58-3.477 117 3.302 175 8.343 58 4.867 116 8.344 174 4.867 58-3.302 117-13.21 175-26.595 58-13.385 116-30.073 174-30.073 59 0 117 16.688 175 26.77 58 9.908 116 13.211 174 14.949 59 1.739 117 1.739 146 1.739h29V180H0v-39.98z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="bg-[#5865F2] text-white py-4">
          <section className="prose mx-auto p-2">
            <h2 className="text-center text-white">Discord</h2>

            <div className="not-prose">
              <iframe
                src="https://discord.com/widget?id=883759326131540000&amp;theme=dark"
                width="350"
                height="500"
                {...{ ["allowtransparency"]: "true" }}
                frameBorder={0}
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                className="mx-auto max-w-full select-none"
                title="Discord"
                lang="en"
                loading="lazy"
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
