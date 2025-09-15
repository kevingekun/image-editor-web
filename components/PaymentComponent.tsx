
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';

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
    const [amount, setAmount] = useState('5');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCreateOrder = async () => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        const numericAmount = parseInt(amount, 10);
        if(isNaN(numericAmount) || numericAmount < 5 || numericAmount % 5 !== 0) {
            setError("Amount must be $5 or more, in multiples of 5.");
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            const { stripe } = await createOrder(numericAmount);
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
            <p className="text-gray-400">$5 = 10 Points. You must be logged in to purchase.</p>
            <div>
                <Input 
                    label="Amount (USD)"
                    type="text"
                    inputMode="numeric"
                    id="amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g., 10"
                />
            </div>
             {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button onClick={handleCreateOrder} isLoading={isLoading} className="w-full">
                {isAuthenticated ? 'Proceed to Payment' : 'Login to Purchase'}
            </Button>
        </div>
    )
}

export default PaymentComponent;