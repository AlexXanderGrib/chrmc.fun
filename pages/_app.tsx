import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import Footer from "../components/Footer";
import "../styles/globals.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbar from "../components/Navbar";
import { AppProps } from "next/app";
import Analytics from "../components/Analytics";
import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

function MyApp({ Component, pageProps, router }: AppProps) {
  const { locale, defaultLocale, locales, asPath } = router;
  const [show, setShow] = useState(true);

  useEffect(() => {
    const { events } = router;
    const beforeNavigation = () => setShow(false);
    const afterNavigation = () => setShow(true);

    events.on("routeChangeStart", beforeNavigation);
    events.on("routeChangeComplete", afterNavigation);
    events.on("routeChangeError", afterNavigation);

    return () => {
      events.off("routeChangeStart", beforeNavigation);
      events.off("routeChangeComplete", afterNavigation);
      events.off("routeChangeError", afterNavigation);
    };
  }, [router, setShow]);

  const getPath = (locale: string) => {
    if (locale !== defaultLocale) {
      return `/${locale}${asPath}`;
    }

    if (asPath === "/") {
      return `/${defaultLocale}`;
    }

    return asPath;
  };
  const path = getPath(locale);
  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
        <meta property="og:site_name" content="DiCraft" />
        <meta property="og:locale:alternate" content="en" />
        <meta property="og:url" content={`https://dicraft.net${path}`} />
        {locales
          ?.filter((loc) => loc !== locale)
          .map((locale) => (
            <link
              key={locale}
              rel="alternate"
              hrefLang={locale}
              href={`https://dicraft.net${getPath(locale)}`}
            />
          ))}
      </Head>

      <div itemScope itemType="https://schema.org/WebPage">
        <Navbar />
        <div className="min-h-screen">
          <Transition
            appear={true}
            show={show}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Component {...pageProps} />
          </Transition>
        </div>

        <Footer />
      </div>

      <Analytics
        googleTag="G-7JMR9BLX1N"
        yandexMetrika="87563257"
        vkPixel="VK-RTRG-1215466-fkqbK"
      />
    </>
  );
}

export default appWithTranslation(MyApp);
