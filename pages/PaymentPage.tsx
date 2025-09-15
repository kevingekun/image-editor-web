import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import PaymentComponent, { PurchasePointsForm } from '../components/PaymentComponent';
import { STRIPE_PUBLISHABLE_KEY } from '../constants';
import Card from '../components/ui/Card';
// FIX: `useAuth` is imported from `../hooks/useAuth` not `../contexts/AuthContext`.
import { useAuth } from '../hooks/useAuth';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PaymentPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();
  const { refreshUserPoints } = useAuth();

  const handlePaymentSuccess = () => {
      // Refresh points and navigate back to dashboard after a short delay
      setTimeout(() => {
          refreshUserPoints();
          navigate('/');
      }, 3000);
  }

  const options: StripeElementsOptions = {
    clientSecret,
    locale: 'en', // Force Stripe Elements to use English
    appearance: {
        theme: 'night',
        labels: 'floating',
        variables: {
            colorPrimary: '#6366f1',
            colorBackground: '#1f2937',
            colorText: '#d1d5db',
            colorDanger: '#ef4444',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '4px',
        }
    },
  };

  return (
    <div className="max-w-lg mx-auto">
        <Card>
            {!clientSecret ? (
                <PurchasePointsForm setClientSecret={setClientSecret} />
            ) : (
                <Elements options={options} stripe={stripePromise}>
                    <PaymentComponent clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess}/>
                </Elements>
            )}
        </Card>
    </div>
  );
};

export default PaymentPage;