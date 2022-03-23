type Localized<T> = T & {
  localized: {
    value: string;
    locale: string;
    clientSide?: boolean;
  };
};

type CurrencyAmount = {
  amount: number;
  currency: string;
};

export function formatCurrency(
  amount: number,
  currency: string,
  locale: string
): Localized<CurrencyAmount> {
  let value: string;
  let clientSide = false;

  try {
    const formatter = new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency
    });

    value = formatter.format(amount);
    locale = navigator.language;
    clientSide = true;
  } catch {}

  try {
    if (value) throw new Error();

    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency
    });

    value = formatter.format(amount);
  } catch {}

  try {
    if (value) throw new Error();
    const nonBreakingSpace = String.fromCharCode(160);

    value = `${amount.toFixed(2)} ${currency}`.replace(/\s/, nonBreakingSpace);
  } catch {}

  return {
    amount,
    currency,
    localized: {
      locale,
      value,
      clientSide
    }
  };
}
