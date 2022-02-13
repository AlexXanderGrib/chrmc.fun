import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";
import "../styles/globals.css";

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
        <meta
          property="og:image"
          content="/images/assets/aye-kosmonavt-og.jpg"
        />
        <meta property="og:locale" content={locale} />
        <meta property="og:site_name" content="Chrome MC" />
        <meta property="og:locale:alternate" content="en_US" />
      </Head>

      <Component {...pageProps} />

      <footer lang="en" className="text-gray-100">
        <div className="bg-gray-800 p-8">
          <ul className="flex list-none gap-4 flex-wrap justify-center">
            <li>
              <a href="https://vk.com/chrome_mc" rel="noopener" target="_blank">
                <img
                  src="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/32/ffffff/external-vk-a-russian-online-social-media-and-social-networking-service-logo-bold-tal-revivo.png"
                  srcSet="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/64/ffffff/external-vk-a-russian-online-social-media-and-social-networking-service-logo-bold-tal-revivo.png 2x"
                  alt="VK"
                  draggable="false"
                  width="32"
                  height="32"
                />
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/V6dCEUhsbt"
                rel="noopener"
                target="_blank"
              >
                <img
                  src="https://img.icons8.com/ios-filled/32/ffffff/discord--v2.png"
                  srcSet="https://img.icons8.com/ios-filled/64/ffffff/discord--v2.png 2x"
                  alt="Discord"
                  draggable="false"
                  width="32"
                  height="32"
                />
              </a>
            </li>
          </ul>
        </div>
        <div className="bg-gray-900">
          <div className="text-center p-8 font-bold">
            Chrome MC &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </>
  );
}

export default appWithTranslation(MyApp);
