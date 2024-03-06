import React from 'react';
import ReactDOM from 'react-dom';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CheckoutPage from './schedule';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51OKdzKIO5u1pqsD2UrO0ycpEWUkXOT6OvGzZWXiIqp9KI4FclQC8dWHaBgifn6cJs9UtrcjO3FBQCQzGnZ1HUCan00djYYkY17');

function Index() {
  const options = {
    mode: 'payment',
    amount: 1299,
    currency: 'zar',
    // Customizable with appearance API.
    appearance: {/*...*/},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutPage />
    </Elements>
  );
};
export default Index;