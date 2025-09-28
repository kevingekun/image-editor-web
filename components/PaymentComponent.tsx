
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY, Currency, getMinimumAmount, calculatePoints } from '../constants';

const PaymentComponent: React.FC<{ clientSecret: string; onPaymentSuccess: () => void }> = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
        setMessage(error.message || 'An error occurred.');
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else {
        setMessage("Payment successful! Your points will be updated shortly.");
        onPaymentSuccess();
    }
    
    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      <Button disabled={isLoading || !stripe || !elements} id="submit" isLoading={isLoading} className="w-full">
        Pay now
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
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // 获取当前选中的货币信息
    const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currency) || SUPPORTED_CURRENCIES[0];
    const minimumAmount = getMinimumAmount(currency);
    
    // 当货币改变时，自动填入最小金额
    React.useEffect(() => {
        setAmount(minimumAmount.toString());
    }, [currency, minimumAmount]);
    
    // 计算可获得的积分
    const numericAmount = parseInt(amount, 10) || 0;
    const pointsToEarn = calculatePoints(numericAmount, currency);

    const handleCreateOrder = async () => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        if(isNaN(numericAmount) || numericAmount < minimumAmount) {
            setError(`Amount must be at least ${selectedCurrency.symbol}${minimumAmount} (equivalent to $5 USD).`);
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
            <h3 className="text-xl font-bold text-white">Purchase Points</h3>
            <p className="text-gray-400">
                Base rate: $5 USD = 10 Points. Other currencies calculated at equivalent rates.
            </p>
            
            {/* 货币选择 */}
            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                    Currency
                </label>
                <select 
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    {SUPPORTED_CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name} ({curr.code})
                        </option>
                    ))}
                </select>
            </div>
            
            <div>
                <Input 
                    label={`Amount (${selectedCurrency.code})`}
                    type="text"
                    inputMode="numeric"
                    id="amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder={`Minimum: ${minimumAmount}`}
                />
                <p className="text-sm text-gray-400 mt-1">
                    Minimum: {selectedCurrency.symbol}{minimumAmount} • 
                    You will get: <span className="font-bold text-indigo-400">{pointsToEarn}</span> points
                </p>
            </div>
            
             {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button onClick={handleCreateOrder} isLoading={isLoading} className="w-full">
                {isAuthenticated ? `Pay ${selectedCurrency.symbol}${numericAmount || minimumAmount}` : 'Login to Purchase'}
            </Button>
        </div>
    )
}

export default PaymentComponent;