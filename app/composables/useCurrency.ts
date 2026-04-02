import type { Currency } from '~/types/currency'

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2, flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0, flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimals: 2, flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2, flag: '🇮🇳' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2, flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimals: 2, flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2, flag: '🇨🇭' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimals: 0, flag: '🇰🇷' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2, flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', decimals: 2, flag: '🇲🇽' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2, flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2, flag: '🇭🇰' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimals: 2, flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimals: 2, flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimals: 2, flag: '🇩🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2, flag: '🇳🇿' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', decimals: 2, flag: '🇿🇦' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', decimals: 2, flag: '🇷🇺' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', decimals: 2, flag: '🇹🇷' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', decimals: 2, flag: '🇵🇱' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', decimals: 2, flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 0, flag: '🇮🇩' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', decimals: 2, flag: '🇲🇾' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', decimals: 2, flag: '🇵🇭' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', decimals: 2, flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', decimals: 2, flag: '🇸🇦' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', decimals: 2, flag: '🇶🇦' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', decimals: 2, flag: '🇮🇱' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', decimals: 2, flag: '🇨🇿' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', decimals: 0, flag: '🇭🇺' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', decimals: 0, flag: '🇨🇱' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', decimals: 0, flag: '🇨🇴' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', decimals: 2, flag: '🇦🇷' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', decimals: 2, flag: '🇵🇰' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', decimals: 2, flag: '🇧🇩' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', decimals: 2, flag: '🇳🇬' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', decimals: 2, flag: '🇪🇬' },
  { code: 'VND', name: 'Vietnamese Đồng', symbol: '₫', decimals: 0, flag: '🇻🇳' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', decimals: 2, flag: '🇹🇼' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', decimals: 2, flag: '🇵🇪' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', decimals: 3, flag: '🇰🇼' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', decimals: 3, flag: '🇧🇭' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', decimals: 3, flag: '🇴🇲' },
]

export function useCurrency() {
  const selectedCurrency = useState('currency', () => 'USD')
  const currencies = CURRENCIES

  const currentCurrency = computed(() =>
    currencies.find(c => c.code === selectedCurrency.value) ?? currencies[0],
  )

  const formatCurrency = (amount: number, currencyCode?: string): string => {
    const code = currencyCode ?? selectedCurrency.value
    const currency = currencies.find(c => c.code === code) ?? currencies[0]

    const locale = import.meta.client ? navigator.language : 'en-US'

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(amount)
  }

  const formatCompact = (amount: number): string => {
    if (Math.abs(amount) >= 1_000_000) {
      return `${formatCurrency(amount / 1_000_000)}M`
    }
    if (Math.abs(amount) >= 1_000) {
      return `${formatCurrency(amount / 1_000)}K`
    }
    return formatCurrency(amount)
  }

  const parseCurrencyInput = (value: string): number => {
    return Number.parseFloat(value.replace(/[^0-9.-]/g, '')) || 0
  }

  return {
    selectedCurrency,
    currentCurrency,
    currencies,
    formatCurrency,
    formatCompact,
    parseCurrencyInput,
  }
}
