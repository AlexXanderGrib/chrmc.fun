import { countryToCurrency } from "./countries";
import { rates, baseCurrency } from "./rates";

export { countryToCurrency, rates, baseCurrency };

export function convert(
  amount: number,
  originCurrency: string,
  destinationCurrency: string
): number {
  const originRate = rates[originCurrency];
  if (!originRate) {
    throw new Error(
      `Unable to get conversion rate for origin currency "${originCurrency}"`
    );
  }

  const destinationRate = rates[destinationCurrency];
  if (!destinationRate) {
    throw new Error(
      `Unable to get conversion rate for destination currency "${destinationCurrency}"`
    );
  }

  return (amount / originRate) * destinationRate;
}

export function getCountryCurrency(countryCode: string, backupCurrency = baseCurrency) {
  const currency: string = countryToCurrency[countryCode] ?? backupCurrency;

  return { currency, rate: convert(1, baseCurrency, currency) }
}
