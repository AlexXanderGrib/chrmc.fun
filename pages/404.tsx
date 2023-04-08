import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
import Error from "next/error";
import { GetStaticProps } from "next";

export const config = {
	runtime: 'edge',
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["common", "footer", "nav","error"],
      nextI18NextConfig
    ))
  }
});

export default function Custom404() {
  const { t } = useTranslation("error");
  return <Error statusCode={404} title={t("404")} />;
}
