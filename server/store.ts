import type { Package, Category as TebexCategory } from "tebex/dist/types";
import { baseCurrency, convert, getCountryCurrency } from "../shared/currency";
import { datocms, tebex } from "./config";

export type Localized<T> = T & {
  localized: {
    locale: string;
    value: string;
  };
};

export type Price = {
  currency: string;
  value: number;
};

export type Product = {
  id: number;
  image?: string;
  price: {
    base: Localized<Price>;
    local: Localized<Price>;
  };
  name: string;
  description?: { value: any };
  duration?:
    | "forever"
    | Localized<{
        unit: Intl.RelativeTimeFormatUnit;
        amount: number;
      }>;
};

export type Category = {
  id: number;
  name: string;
  products: Product[];
};

type BaseCategory = Category & {
  subcategories: Category[];
};

export const localeToCurrency = {
  en: "USD",
  ru: "RUB"
};

const memoCache: Record<string, [cachedAt: number, value: any]> = {};

async function memo<T>(
  key: string,
  ms: number,
  fn: () => T | Promise<T>
): Promise<T> {
  const cached = memoCache[key] ?? [0, null];
  if (Date.now() - ms < cached[0]) return cached[1];

  const value = await fn();

  memoCache[key] = [Date.now(), value];
  return value;
}

export async function fetchProducts(
  locale: string,
  defaultLocale: string,
  country = "US",
  currency?: string
): Promise<BaseCategory[]> {
  country = country.toUpperCase();
  const isDev = process.env.NODE_ENV === "development";
  const [information, listing, packages, { allCategories, allProducts }] =
    await Promise.all([
      memo("tebex-info", isDev ? 10 : 120_000, () => tebex.information.get()),
      memo("tebex-listing", isDev ? 10 : 30_000, () => tebex.listing.get()),
      memo("tebex-packages", isDev ? 10 : 30_000, () => tebex.packages.get()),
      memo(`datocms-products-${locale}`, isDev ? 10 : 300_000, () =>
        datocms.request(
          `
        query Store($locale: SiteLocale!, $defaultLocale: SiteLocale!) {
          allCategories(
            locale: $locale
            fallbackLocales: [$defaultLocale]
          ) {
            tebexId
            name
          }

          allProducts(
            locale: $locale
            fallbackLocales: [$defaultLocale]
          ) {
            description {
              value
            }
            name
            tebexId
          }
        }`,
          { locale, defaultLocale }
        )
      )
    ]);

  const processPackage = (pack: Package): Product => {
    const translation = allProducts.find((p) => p.tebexId === pack.id);
    const price = convert(
      pack.price,
      information.account.currency.iso_4217,
      baseCurrency
    );
    const { currency: localCurrency } = currency
      ? { currency }
      : getCountryCurrency(
          country,
          localeToCurrency[locale] ?? localeToCurrency[defaultLocale]
        );
    const localPrice = convert(
      pack.price,
      information.account.currency.iso_4217,
      localCurrency
    );

    const baseCurrencyFormatter = new Intl.NumberFormat(
      [locale, defaultLocale],
      {
        style: "currency",
        currency: baseCurrency
      }
    );

    const localCurrencyFormatter = new Intl.NumberFormat(
      [locale, defaultLocale],
      {
        style: "currency",
        currency: localCurrency
      }
    );

    const product: Product = {
      id: pack.id,
      name: translation?.name ?? pack.name,
      image: pack.image ? pack.image : undefined,
      price: {
        base: {
          currency: baseCurrency,
          value: price,
          localized: {
            locale,
            value: baseCurrencyFormatter.format(price)
          }
        },
        local: {
          currency: localCurrency,
          value: localPrice,
          localized: {
            locale,
            value: localCurrencyFormatter.format(localPrice)
          }
        }
      }
    };

    if (translation?.description) {
      product.description = translation?.description;
    }

    if (pack.expiry_length >= 1) {
      const formatter = new Intl.RelativeTimeFormat([locale, defaultLocale]);

      product.duration = {
        amount: pack.expiry_length,
        unit: pack.expiry_period,
        localized: {
          locale,
          value: formatter.format(pack.expiry_length, pack.expiry_period)
        }
      };
    } else {
      product.duration = "forever";
    }

    return product;
  };

  const processCategory = (category: TebexCategory): Category => ({
    id: category.id,
    name:
      allCategories.find((c) => c.tebexId === category.id)?.name ??
      category.name,
    products: category.packages.map((pkg) =>
      processPackage(packages.find((pack) => pack.id === pkg.id))
    )
  });

  return listing.map((value) => ({
    ...processCategory(value),
    subcategories: value.subcategories.map(processCategory)
  }));
}
