import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config.js";
import { ClipboardCopyIcon, LightningBoltIcon } from "@heroicons/react/solid";
import Head from "next/head";

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18NextConfig))
  }
});

export default function Java() {
  const { t } = useTranslation("common");

  return (
    <div
      className="min-h-screen flex px-4 py-8 flex-col gap-4 items-center justify-center"
      style={{
        background:
          "url(https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e6/Oak_Planks_%28texture%29_JE6_BE3.png) repeat black"
      }}
    >
      <Head>
        <title>
          {t("join.actions.how-to-join")} ({t("guides.consoles.title")})
        </title>
      </Head>
      <div className="max-w-xl w-full bg-white p-4 rounded-lg">
        <h1 className="text-xl font-bold mt-4">
          {t("join.actions.how-to-join")} ({t("guides.consoles.title")})
        </h1>
        <div className="h-px bg-gray-400 w-full my-2" />
        <a
          className="aspect-w-16 aspect-h-9 rounded overflow-hidden w-full block"
          href={t("guides.consoles.article.link")}
          style={{
            background: `url(${t("guides.consoles.article.thumbnail")})`
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="absolute w-full h-full left-0 right-0 bg-gray-800 opacity-70" />
          <div className="absolute w-full h-full left-0 right-0 flex flex-col gap-2 items-center justify-center text-white">
            <h2 className="font-bold text-2xl truncate">
              {t("guides.consoles.article.title")}
            </h2>
            <div className="bg-white text-black px-4 py-1 font-bold rounded flex flex-row items-center gap-2">
              <LightningBoltIcon className="w-4 h-4" />
              {t("actions.read")}
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
