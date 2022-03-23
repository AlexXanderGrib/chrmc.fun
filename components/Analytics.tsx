import Script from "next/script";
import { If } from "./If";

export default function Analytics({
  vkPixel = "",
  yandexMetrika = "",
  googleTag = ""
}) {
  return (
    <>
      <If condition={!!googleTag}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleTag}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${googleTag}');
          `}
        </Script>
      </If>
      <If condition={!!yandexMetrika}>
        <Script id="yandex-metrika" strategy="lazyOnload">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${yandexMetrika}, "init", {
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
              src={`https://mc.yandex.ru/watch/${yandexMetrika}`}
              style={{ position: "absolute", top: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </If>
      <If condition={!!vkPixel}>
        <Script id="vk-pixel" strategy="lazyOnload">
          {`!function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://vk.com/js/api/openapi.js?169",t.onload=function(){VK.Retargeting.Init("${vkPixel}"),VK.Retargeting.Hit()},document.head.appendChild(t)}();`}
        </Script>

        <noscript>
          <img
            src={`https://vk.com/rtrg?p=${vkPixel}`}
            style={{ position: "absolute", top: "-9999px" }}
            alt=""
          />
        </noscript>
      </If>
    </>
  );
}
