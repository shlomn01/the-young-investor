export function formatCurrency(amount: number, lang: 'he' | 'en' = 'he'): string {
  const formatted = amount.toLocaleString(lang === 'he' ? 'he-IL' : 'en-US');
  return lang === 'he' ? `₪${formatted}` : `₪${formatted}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatShares(shares: number, lang: 'he' | 'en' = 'he'): string {
  if (lang === 'he') {
    return shares === 1 ? 'מניה אחת' : `${shares} מניות`;
  }
  return shares === 1 ? '1 share' : `${shares} shares`;
}
