import { GetServerSideProps, GetStaticProps } from "next";
import { useCallback, useEffect, useState } from "react";
import { If } from "../components/If";
import { fetchProducts, localeToCurrency, Product } from "../server/store";
import { StructuredText } from "react-datocms";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../next-i18next.config";
import { useTranslation } from "next-i18next";
import {
  baseCurrency,
  convert,
  getCountryCurrency,
  rates
} from "../shared/currency";
import cookie from "cookie";
import { useRouter } from "next/router";
import Link from "../components/Link";
import { round } from "@xxhax/safe-math";
import Head from "next/head";

function ProductView({ product }: { product: Product }) {
  const { locale, defaultLocale } = useRouter();
  const { t } = useTranslation("shop");

  return (
    <article
      key={product.id}
      className="group relative mx-auto"
      itemProp="itemListElement"
      itemScope
      itemType="https://schema.org/Product"
    >
      <meta itemProp="sku" content={product.id.toString()} />
      <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
        <img
          src={product.image}
          alt=""
          className="w-full h-full object-center object-cover lg:w-full lg:h-full select-none"
          itemProp="image"
          loading="lazy"
          draggable="false"
          width="512"
          height="512"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h4 className="text-sm text-gray-700">
            <Link href={`/store/${product.id}`} itemProp="url">
              <span aria-hidden="true" className="absolute inset-0" />
              <span itemProp="name" lang={defaultLocale}>
                {product.name}
              </span>
            </Link>
          </h4>
          <If condition={!!product.description}>
            <div className="hidden" itemProp="description">
              <StructuredText data={product.description} />
            </div>
          </If>
          <If condition={!!product.duration}>
            <p className="mt-1 text-sm text-gray-500">
              {typeof product.duration === "object" && product.duration ? (
                <>
                  <span lang={locale}>{t("expires")}</span>{" "}
                  <span lang={product.duration.localized.locale}>
                    {product.duration.localized.value}
                  </span>
                </>
              ) : (
                t("forever")
              )}
            </p>
          </If>
        </div>
        <div
          className="text-sm font-medium text-gray-900 text-right"
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <span lang={product.price.local.localized.locale}>
            {product.price.local.localized.value}
          </span>
          <meta itemProp="sku" content={product.id.toString()} />
          <link itemProp="availability" href="https://schema.org/InStock" />
          {/* <meta itemProp="priceValidUntil" content={} /> */}
          <Link itemProp="url" href={`/store/${product.id}`} />
          <meta
            itemProp="price"
            content={round(product.price.local.value, 2).toFixed(2)}
          />
          <meta
            itemProp="priceCurrency"
            content={product.price.local.currency}
          />
          <If
            condition={
              product.price.local.currency !== product.price.base.currency
            }
          >
            <div className="text-gray-400">
              ≈
              <span lang={product.price.base.localized.locale}>
                {product.price.base.localized.value}
              </span>
            </div>
          </If>
        </div>
      </div>
    </article>
  );
}

function ProductList({ list = [] as Product[] }) {
  if (list.length === 0) return null;

  return (
    <div className="not-prose">
      <ul
        itemScope
        itemType="https://schema.org/ItemList"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {list.map((product) => (
          <li key={product.id}>
            <ProductView product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
  defaultLocale
}) => {
  let country = (req.headers["cf-ipcountry"] ?? "US").toString().toUpperCase();
  if (country === "XX") country = "US";

  let cookies: Record<string, string>;

  try {
    cookies = cookie.parse(req.headers.cookie ?? "");
  } catch {}

  const { currency } =
    cookies.currency in rates
      ? { currency: cookies.currency }
      : getCountryCurrency(
          country,
          localeToCurrency[locale] ?? localeToCurrency[defaultLocale]
        );
  return {
    props: {
      listing: await fetchProducts(locale, defaultLocale, country, currency),
      userCurrency: currency,
      ...(await serverSideTranslations(
        locale,
        ["shop", "common", "footer", "nav"],
        nextI18NextConfig
      ))
    }
  };
};

export default function Store({
  listing = [] as Awaited<ReturnType<typeof fetchProducts>>,
  userCurrency = "USD"
}) {
  const [currency, setCurrency] = useState(userCurrency);
  const [loadedListing, setListing] = useState(listing);
  const { t } = useTranslation("shop");
  const { locale, defaultLocale } = useRouter();

  const updateProducts = ({ updateLocalPrices = true } = {}) => {
    const products = loadedListing
      .flatMap((category) => [category, ...category.subcategories])
      .flatMap((category) => category.products);

    for (const product of products) {
      const browserLocale = navigator.language;

      if (
        product.price.base.localized.locale !== browserLocale &&
        Intl?.NumberFormat
      ) {
        try {
          const formatter = new Intl.NumberFormat(browserLocale, {
            style: "currency",
            currency: product.price.base.currency
          });

          product.price.base.localized = {
            locale: browserLocale,
            value: formatter.format(product.price.base.value)
          };
        } catch {}
      }

      if (
        product.duration &&
        typeof product.duration === "object" &&
        product.duration.localized.locale !== browserLocale &&
        Intl?.RelativeTimeFormat
      ) {
        try {
          const formatter = new Intl.RelativeTimeFormat(browserLocale);

          product.duration.localized = {
            locale: browserLocale,
            value: formatter.format(
              product.duration.amount,
              product.duration.unit
            )
          };
        } catch {}
      }

      if (updateLocalPrices) {
        const localCurrency =
          currency in rates
            ? currency
            : getCountryCurrency(
                "US",
                localeToCurrency[locale] ?? localeToCurrency[defaultLocale]
              ).currency;

        const localPrice = convert(
          product.price.base.value,
          product.price.base.currency,
          localCurrency
        );

        let formattedPrice: string;

        try {
          const formatter = new Intl.NumberFormat(browserLocale, {
            style: "currency",
            currency: localCurrency
          });

          formattedPrice = formatter.format(localPrice);
        } catch {
          formattedPrice = `${round(localPrice, 5)} ${localCurrency}`;
        }

        product.price.local = {
          currency: localCurrency,
          value: localPrice,
          localized: {
            locale: browserLocale,
            value: formattedPrice
          }
        };
      }
    }

    setListing([...loadedListing]);
  };

  useEffect(() => {
    document.cookie = `currency=${currency};path=/;max-age=31536000;samesite=strict`;
    updateProducts();
  }, [currency]);

  return (
    <div className="prose prose-lg max-w-5xl mx-auto px-4 py-8">
      <Head>
        <title>{t("shop")}</title>
      </Head>
      <h1 className="font-heading">{t("shop")}</h1>

      <label>
        <div>{t("select-currency")}</div>
        <select
          onChange={(event) => {
            setCurrency(event.target.value);
          }}
          value={currency}
        >
          {Object.keys(rates).map((currency) => (
            <option value={currency} key={currency}>
              {currency}
            </option>
          ))}
        </select>
      </label>

      {loadedListing.map((category) => (
        <section key={category.id}>
          <h2 className="font-heading">{category.name}</h2>

          <ProductList list={category.products} />

          {category.subcategories.map((category) => (
            <div key={category.id}>
              <h3 className="font-heading">{category.name}</h3>

              <ProductList list={category.products} />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
