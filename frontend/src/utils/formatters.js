export const getCurrencySymbol = (currencyStr) => {
  if (!currencyStr) return '$';
  const match = currencyStr.match(/\((.*)\)/);
  return match ? match[1] : '$';
};

export const formatCurrency = (amount, currencyStr) => {
  const symbol = getCurrencySymbol(currencyStr);
  const val = Number(amount) || 0;
  
  // Use absolute value for formatting if needed, but usually we handle sign outside
  const formatted = Math.abs(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return val < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
};
