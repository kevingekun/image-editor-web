
import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { createOrder, getExchangeRates } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY, Currency, getMinimumAmount, calculatePoints, updateCurrencyRates } from '../constants';

const PaymentComponent: React.FC<{ clientSecret: string; onPaymentSuccess: () => void }> = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${window.location.pathname}#/`,
      },
      // We will handle the result ourselves instead of redirecting
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || t('payment.cardError'));
      } else {
        setMessage(t('payment.unexpectedError'));
      }
    } else {
        setMessage(t('payment.paymentSuccess'));
        onPaymentSuccess();
    }
    
    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      <Button disabled={isLoading || !stripe || !elements} id="submit" isLoading={isLoading} className="w-full">
        {t('payment.payNow')}
      </Button>
      {message && <div id="payment-message" className="text-center text-green-400 mt-4">{message}</div>}
    </form>
  );
};

export const PurchasePointsForm: React.FC<{setClientSecret: (secret: string) => void}> = ({setClientSecret}) => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentRates, setCurrentRates] = useState<Record<string, number> | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    
    // 根据语言获取货币名称
    const getCurrencyName = (curr: Currency) => {
        // 人民币始终显示中文
        if (curr.code === 'CNY') {
            return curr.name; // '人民币'
        }
        // 其他货币根据当前语言决定
        if (language === 'zh') {
            // 中文环境下的翻译
            const zhNames: Record<string, string> = {
                'USD': '美元',
                'EUR': '欧元',
                'JPY': '日元',
                'GBP': '英镑',
                'HKD': '港币'
            };
            return zhNames[curr.code] || curr.name;
        }
        // 英文环境下，使用英文名称
        return curr.name;
    };

    // 获取汇率数据
    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const ratesData = await getExchangeRates();
                if (ratesData.success && ratesData.rates) {
                    setCurrentRates(ratesData.rates);
                    setLastUpdated(ratesData.lastUpdated);
                    updateCurrencyRates(ratesData.rates);
                } else {
                    console.warn('Failed to fetch exchange rates:', ratesData.message);
                    // 使用默认汇率
                    setCurrentRates(null);
                }
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                // 使用默认汇率
                setCurrentRates(null);
            }
        };

        fetchExchangeRates();
    }, []);

    // 获取当前选中的货币信息
    const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currency) || SUPPORTED_CURRENCIES[0];
    const minimumAmount = getMinimumAmount(currency, currentRates || undefined);
    
    // 当货币改变时，如果当前金额为空或小于最小金额，则设置为最小金额
    React.useEffect(() => {
        const numericAmount = parseInt(amount, 10) || 0;
        if (numericAmount < minimumAmount) {
            setAmount(minimumAmount.toString());
        }
    }, [currency, minimumAmount]);
    
    // 计算可获得的积分
    const numericAmount = parseInt(amount, 10) || 0;
    const pointsToEarn = calculatePoints(numericAmount, currency, currentRates || undefined);

    const handleCreateOrder = async () => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        if(isNaN(numericAmount) || numericAmount < minimumAmount) {
            setError(`${t('payment.minAmountError')} ${selectedCurrency.symbol}${minimumAmount} (equivalent to $5 USD).`);
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            const { stripe } = await createOrder(numericAmount, currency);
            setClientSecret(stripe.client_secret);
        } catch(err: any) {
            setError(err.message || "Failed to create payment intent.");
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{t('payment.purchasePoints')}</h3>
            <p className="text-gray-400">
                {t('payment.rateDescription')}
            </p>
            
            {/* 汇率更新时间 */}
            {lastUpdated && (
                <p className="text-xs text-gray-500">
                    {t('payment.exchangeRatesUpdated')}: {new Date(lastUpdated).toLocaleString()}
                </p>
            )}
            
            {/* 货币选择 */}
            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                    {t('payment.currency')}
                </label>
                <select 
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    {SUPPORTED_CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                            {curr.symbol} {getCurrencyName(curr)} ({curr.code})
                        </option>
                    ))}
                </select>
            </div>
            
            <div>
                <Input 
                    label={`${t('payment.amount')} (${selectedCurrency.code})`}
                    type="text"
                    inputMode="numeric"
                    id="amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder={`${t('payment.enterAmount')} (${t('payment.minimum').toLowerCase()}: ${minimumAmount})`}
                />
                <p className="text-sm text-gray-400 mt-1">
                    {t('payment.minimum')}: {selectedCurrency.symbol}{minimumAmount} • 
                    {t('payment.youWillGet')}: <span className="font-bold text-indigo-400">{pointsToEarn}</span> {t('payment.points').toLowerCase()}
                    {numericAmount > 0 && currentRates && (
                        <span className="text-gray-500 ml-2">
                            ({t('payment.rate')}: {selectedCurrency.symbol}1 = {(2 / (currentRates[currency] || 1)).toFixed(4)} {t('payment.points').toLowerCase()})
                        </span>
                    )}
                </p>
            </div>
            
             {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button onClick={handleCreateOrder} isLoading={isLoading} className="w-full">
                {isAuthenticated ? `${t('payment.pay')} ${selectedCurrency.symbol}${numericAmount || minimumAmount}` : t('payment.loginToPurchase')}
            </Button>
        </div>
    )
}

export default PaymentComponent;