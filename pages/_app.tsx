import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import Footer from "../components/Footer";
import "../styles/globals.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import Navbar from "../components/Navbar";


function MyApp({ Component, pageProps }) {
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="apple-mobile-web-app-title" content="Chrome MC" />
        <meta name="application-name" content="Chrome MC" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
        <meta property="og:site_name" content="Chrome MC" />
        <meta property="og:locale:alternate" content="en_US" />
      </Head>

      <Navbar />
        
      <Component {...pageProps} />

      <Footer />

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
    </>
  );
}

export default appWithTranslation(MyApp);
