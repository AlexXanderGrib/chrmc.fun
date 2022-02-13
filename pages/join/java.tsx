import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config.js";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
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
          "url(https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/3d/Dirt_%28texture%29_JE2_BE2.png) repeat black"
      }}
    >
      <Head>
        <title>
          {t("join.actions.how-to-join")} ({t("guides.bedrock.title")})
        </title>
      </Head>
      <div className="max-w-xl w-full bg-white p-4 rounded-lg">
        <h1 className="text-xl font-bold mt-4">
          {t("join.actions.how-to-join")} ({t("guides.java.title")})
        </h1>
        <div className="h-px bg-gray-400 w-full my-2" />
        <form
          className="grid gap-y-2 grid-cols-[auto_6rem_4rem] grid-rows-[auto_4rem] w-full"
          onSubmit={(e) => {
            e.preventDefault();

            navigator.clipboard.writeText(t("server.ip"));
          }}
        >
          <label htmlFor="address" className="text-gray-800 font-bold">
            {t("join.address")}
          </label>
          <label htmlFor="port" className="text-gray-800 font-bold">
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
        <p className="text-center text-gray-500">
          {t("join.version")}: {t("server.javaVersion")}
        </p>
      </div>
    </div>
  );
}
