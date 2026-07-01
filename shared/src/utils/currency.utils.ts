import { CURRENCIES } from '../constants/currencies';

export const formatCurrency = (amount: number, currencyCode: string = 'EUR'): string => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  
  if (!currency) {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }

  // Format for different currencies
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const parseCurrency = (value: string): number => {
  // Remove currency symbols and spaces
  const cleaned = value.replace(/[^0-9.,-]/g, '');
  // Replace comma with dot for decimal
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
};

export const formatCompactCurrency = (amount: number, currencyCode: string = 'EUR'): string => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  const symbol = currency?.symbol || currencyCode;

  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M ${symbol}`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K ${symbol}`;
  }
  return `${amount.toFixed(2)} ${symbol}`;
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  return currency?.symbol || currencyCode;
};
