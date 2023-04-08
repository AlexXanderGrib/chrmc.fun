import Error from "next/error";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Locales, loadTranslation } from "../i18n";

export const getStaticProps = (async ({ locale }) => ({
  props: {
    translation: await loadTranslation(locale as Locales)
  }
})) satisfies GetStaticProps;

export default function Custom404({
  translation
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <Error statusCode={404} title={translation.error["404"]} />;
}
