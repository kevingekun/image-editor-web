export const API_BASE_URL = 'https://orc.255032.xyz/image-editor/api/v1';
// export const API_BASE_URL = 'http://127.0.0.1:8060/api/v1';
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
// 这些是备用汇率，当API不可用时使用
export const FALLBACK_CURRENCY_RATES: Record<string, number> = {
  USD: 1.0,    // 基准货币
  EUR: 0.85,   // 1 USD = 0.85 EUR
  CNY: 7.0,    // 1 USD = 7.0 CNY
  JPY: 110,    // 1 USD = 110 JPY
  GBP: 0.75,   // 1 USD = 0.75 GBP
  HKD: 7.8,    // 1 USD = 7.8 HKD
};

// 当前使用的汇率（可以通过API更新）
let CURRENT_RATES: Record<string, number> = {...FALLBACK_CURRENCY_RATES};

// 更新当前汇率
export const updateCurrencyRates = (rates: Record<string, number>) => {
  CURRENT_RATES = { ...rates };
};

// 获取当前汇率
export const getCurrentRates = (): Record<string, number> => {
  return CURRENT_RATES;
};

// 计算指定货币的最小充值金额（等价于5美元）
export const getMinimumAmount = (currencyCode: string, rates?: Record<string, number>): number => {
  const currentRates = rates || getCurrentRates();
  const rate = currentRates[currencyCode] || 1;
  return Math.ceil(BASE_PRICE_USD * rate);
};

// 计算可获得的积分数 - 支持任意金额（只要不小于5美元）
export const calculatePoints = (amount: number, currencyCode: string, rates?: Record<string, number>): number => {
  const currentRates = rates || getCurrentRates();
  const rate = currentRates[currencyCode] || 1;
  const usdEquivalent = amount / rate;
  
  // 确保不小于最低金额
  if (usdEquivalent < BASE_PRICE_USD) {
    return 0;
  }
  
  // 按比例计算积分：每1美元获得2积分（因为$5=10积分）
  return Math.floor((usdEquivalent / BASE_PRICE_USD) * POINTS_PER_BASE_PRICE);
};
