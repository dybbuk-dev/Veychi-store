import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const calculateOrderAmount = (items: any) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log({
    shop_id: req.query.shop_id,
    premium_plan_id: req.query.premium_plan,
  });
  const response = await axios.post(
    'users/premium/make-premium',
    {
      shop_id: req.query.shop_id,
      premium_plan_id: req.query.premium_plan,
    },
    {
      headers: {
        Authorization: 'Bearer ' + req.query.token,
      },
    }
  );
  console.log(response.data);
  return res.redirect(307, req.query.callback_url as string);
}
