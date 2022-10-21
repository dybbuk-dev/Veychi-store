import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Loader from '@components/ui/loader/loader';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

import React from 'react';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Shop } from '@ts-types/generated';
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function ShopPremiumPayment({
  selectedPremium,
  shopData,
}: {
  selectedPremium: any;
  shopData: Shop;
}) {
  const [clientSecret, setClientSecret] = React.useState('');

  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    (async () => {
      try {
        const tkn = Cookies.get('AUTH_CRED')!;
        if (!tkn) return;
        const { token } = JSON.parse(tkn);
        const res: any = await axios.post(
          'users/premium/purchase',
          {
            id: selectedPremium.id,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        console.log({ res });
        setClientSecret(res.data.clientSecret);
      } catch (e) {}
    })();
  }, []);
  const appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#ff14c0',
      colorBackground: '#ffffff',
      colorText: '#000000',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret ? (
        <Elements options={options as any} stripe={stripePromise}>
          <CheckoutForm
            shopData={shopData as any}
            selectedPremium={selectedPremium}
          />
        </Elements>
      ) : (
        <div className="h-full w-full  flex items-center mt-4">
          <div className="border-t-transparent border-solid animate-spin  rounded-full border-blue-400 border-4 h-8 w-8 mx-auto"></div>
        </div>
      )}
    </div>
  );
}
