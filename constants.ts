// export const API_BASE_URL = 'https://orc.255032.xyz/image-editor/api/v1';
export const API_BASE_URL = 'http://127.0.0.1:8060/api/v1';
// export const API_BASE_URL = 'https://www.hangdapeixun.top/image-editor/api/v1';
export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51S6u8RPGIZ2yXetmEF5Pt1p9hD32B1kazJNOQAOgpbjpXQXb09CBFKh1AlFqM5FLntdsrHYXsgKEaCXU7ugcL76f000z5JlbSH'; // Replace with your actual Stripe publishable key

// 支持的货币配置
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'CNY', name: '人民币', symbol: '¥' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
];

// 默认货币
export const DEFAULT_CURRENCY = 'USD';

// 基础定价（以美元为基准）
export const BASE_PRICE_USD = 5; // $5 = 10 points
export const POINTS_PER_BASE_PRICE = 10;

// 参考汇率（实际应用中应使用实时汇率API）
export const CURRENCY_RATES: Record<string, number> = {
  USD: 1.0,    // 基准货币
  EUR: 0.85,   // 1 USD = 0.85 EUR
  CNY: 7.0,    // 1 USD = 7.0 CNY
  JPY: 110,    // 1 USD = 110 JPY
  GBP: 0.75,   // 1 USD = 0.75 GBP
  HKD: 7.8,    // 1 USD = 7.8 HKD
};

// 计算指定货币的最小充值金额（等价于5美元）
export const getMinimumAmount = (currencyCode: string): number => {
  const rate = CURRENCY_RATES[currencyCode] || 1;
  return Math.ceil(BASE_PRICE_USD * rate);
};

// 计算可获得的积分数
export const calculatePoints = (amount: number, currencyCode: string): number => {
  const rate = CURRENCY_RATES[currencyCode] || 1;
  const usdEquivalent = amount / rate;
  return Math.floor((usdEquivalent / BASE_PRICE_USD) * POINTS_PER_BASE_PRICE);
};
