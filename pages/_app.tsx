import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import Footer from "../components/Footer";
import "../styles/globals.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  const { locale, defaultLocale, asPath } = useRouter();
  const path = locale === defaultLocale ? asPath : `/${locale}${asPath}`;

  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
        <meta property="og:site_name" content="Chrome MC" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:url" content={`https://chrmc.fun${path}`} />
      </Head>

      <div itemScope itemType="https://schema.org/WebPage">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-7JMR9BLX1N"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-7JMR9BLX1N');
        `}
      </Script>

      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(87563257, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            ecommerce:"dataLayer"
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src="https://mc.yandex.ru/watch/87563257"
            style={{ position: "absolute", top: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>

      <Script id="vk-pixel" strategy="afterInteractive">
        {`!function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://vk.com/js/api/openapi.js?169",t.onload=function(){VK.Retargeting.Init("VK-RTRG-1215466-fkqbK"),VK.Retargeting.Hit()},document.head.appendChild(t)}();`}
      </Script>

      <noscript>
        <img
          src="https://vk.com/rtrg?p=VK-RTRG-1215466-fkqbK"
          style={{ position: "absolute", top: "-9999px" }}
          alt=""
        />
      </noscript>
    </>
  );
}

export default appWithTranslation(MyApp);
