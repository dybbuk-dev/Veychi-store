import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Loader from '@components/ui/loader/loader';

import React from 'react';
import CheckoutForm from './CheckoutForm';
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function ShopPremiumPayment() {
  const [clientSecret, setClientSecret] = React.useState('');

  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);
  const appearance = {
    theme: 'light',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret ? (
        <Elements options={options as any} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div className="h-full w-full  flex items-center mt-4">
          <div className="border-t-transparent border-solid animate-spin  rounded-full border-blue-400 border-4 h-8 w-8 mx-auto"></div>
        </div>
      )}
    </div>
  );
}
