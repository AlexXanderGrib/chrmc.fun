import Head from "next/head";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
import { GetStaticProps } from "next";
import { ComponentProps, FC, useEffect, useState } from "react";
import { If } from "../components/If";
import {
  ChevronUpIcon,
  ClipboardCopyIcon,
  DesktopComputerIcon,
  DeviceMobileIcon,
  ExternalLinkIcon,
  GlobeAltIcon
} from "@heroicons/react/solid";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["common", "footer"],
      nextI18NextConfig
    ))
  }
});

type PlayerPlatform = "java" | "bedrock" | "consoles";

export default function Home() {
  const { t } = useTranslation("common");
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
        <meta name="description" content={t("seo.description")} />
        <meta name="keywords" content={t("seo.keywords")} />
        <title>{t("seo.title")}</title>
        <meta property="og:image" content="/hero@1x.jpg" />
      </Head>
      <div className="relative min-h-[800px] h-[90vh] max-h-[1200px] w-full">
        <picture>
          <source srcSet="/hero@1x.avif, /hero@2x.avif 2x" type="image/avif" />
          <source srcSet="/hero@1x.webp, /hero@2x.webp 2x" type="image/webp" />
          <img
            src="/hero@1x.jpg"
            srcSet="/hero@2x.jpg 2x"
            className="absolute w-full h-full top-0 left-0 object-cover object-center select-none"
            loading="eager"
            decoding="async"
            draggable="false"
            alt=""
          />
        </picture>
        <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent opacity-60" />
        <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-between items-center">
          <div className="pt-8 text-center text-white" />
          <div className="max-w-lg px-4">
            <hgroup className="text-white text-center flex flex-col gap-4">
              <h1 className="text-3xl font-bold" itemProp="name">{t("seo.title")}</h1>
              <p itemProp="description">{t("seo.description")}</p>
            </hgroup>

            <div className="pt-8">
              <If condition={primaryPlatform === "java"}>
                <form
                  className="grid gap-y-2 grid-cols-[auto_6rem_4rem] grid-rows-[auto_4rem] w-full"
                  onSubmit={(e) => {
                    e.preventDefault();

                    navigator.clipboard.writeText(t("server.ip"));
                  }}
                >
                  <label htmlFor="address" className="text-white font-bold">
                    {t("join.address")}
                  </label>
                  <label htmlFor="port" className="text-white font-bold">
                    {t("join.port")}
                  </label>
                  <span />
                  <input
                    type="text"
                    id="address"
                    readOnly
                    value={t("server.ip") as string}
                    className="rounded-l px-2 w-full"
                  />
                  <input
                    type="number"
                    id="port"
                    readOnly
                    value={t("server.javaPort") as string}
                    className="text-center"
                  />
                  <button className="clickable bg-action-500 hover:bg-action-600 transition-colors text-white w-full h-16 flex items-center justify-center rounded-r font-bold">
                    <ClipboardCopyIcon className="w-6 h-6" />
                  </button>
                </form>
              </If>

              <If condition={primaryPlatform === "bedrock"}>
                <a
                  className="clickable bg-action-500 hover:bg-action-600 transition-colors text-white w-full h-16 flex items-center justify-center rounded font-bold"
                  href={`minecraft://?addExternalServer=${t("server.name")}|${t(
                    "server.ip"
                  )}:${t("server.bedrockPort")}`}
                >
                  {t("join.actions.bedrock-join")}
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
                >
                  {t("join.actions.how-to-join")}
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
                className="fill-white"
                fillRule="evenodd"
                d="M0 140.02l29 6.605c29 6.605 87 19.99 146 11.646 58-8.343 116-38.416 174-39.98 58-1.738 116 25.031 175 31.637 58 6.779 116-6.606 174-9.908 58-3.477 117 3.302 175 8.343 58 4.867 116 8.344 174 4.867 58-3.302 117-13.21 175-26.595 58-13.385 116-30.073 174-30.073 59 0 117 16.688 175 26.77 58 9.908 116 13.211 174 14.949 59 1.739 117 1.739 146 1.739h29V180H0v-39.98z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <main className="mt-8">
        <section className="prose prose-primary mx-auto p-2 my-4">
          <h2 id="join">{t("join.actions.how-to-join")}</h2>

          <div className="flex flex-col gap-4">
            {Object.keys(platforms).map((value) => {
              const [href, Icon] = platforms[value];

              return (
                <Link key={value} href={href} passHref>
                  <a className="flex clickable items-center w-full gap-2 px-6 py-4 text-sm font-medium text-left text-primary-900 bg-primary-100 rounded-lg hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 transition-colors">
                    <div className="flex bg-primary-200 rounded-full w-12 h-12 items-center justify-center p-6 relative">
                      <Icon className="w-6 h-6 absolute" />
                    </div>

                    <div className="whitespace-nowrap">
                      {t(`guides.${value}.title`)}
                    </div>

                    <div className="w-full" />
                    <ExternalLinkIcon className="w-6 h-6" />
                  </a>
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
        <div className="bg-[#5865F2] text-white py-4">
          <section className="prose prose-primary mx-auto p-2">
            <h2 className="text-center text-white">Discord</h2>

            <iframe
              src="https://discord.com/widget?id=883759326131540000&amp;theme=dark"
              width="350"
              height="500"
              allowTransparency
              frameBorder={0}
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="mx-auto"
            ></iframe>
          </section>
        </div>
      </main>
    </>
  );
}
