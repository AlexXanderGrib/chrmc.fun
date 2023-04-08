import Error from "next/error";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Locales, loadTranslation } from "../i18n";

// export const config = {
//   runtime: "experimental-edge"
// };

export const getStaticProps = (async ({ locale }) => ({
  props: {
    translation: await loadTranslation(locale as Locales)
  }
})) satisfies GetStaticProps;

export default function Custom500({
  translation
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <Error statusCode={500} title={translation.error["500"]} />;
}
