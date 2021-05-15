import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";
import PaymentApi from "../api/payment/PaymentApi";

interface DashboardProps {
  path: string;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [loading, setLoading] = React.useState(false);

  const onClickCheckout = async (event) => {
    event.preventDefault();
    setLoading(true);

    const stripe = await loadStripe(
      "pk_test_aKOhvFXppSG39jKNDvVi3tYT006IbA5jQL"
    );

    const paymentResponse = await PaymentApi.requestCheckout();
    const sessionId = paymentResponse.payload.session_id;
    console.log("Got payment Session: ", sessionId);
    const { error } = await stripe.redirectToCheckout({
      sessionId,
      // mode: "subscription",
      // lineItems: [{ price: "price_1Ipw2ECCoJYujIqgPAGPkuYZ", quantity: 1 }],
      // successUrl: `${window.location.origin}/`,
      // cancelUrl: `${window.location.origin}/`,
    });

    if (error) {
      console.warn("Error:", error);
      setLoading(false);
    }
  };

  const checkoutButton = (
    <button disabled={loading} onClick={onClickCheckout}>
      BUY MY BOOK
    </button>
  );

  return (
    <div>
      <div className="p-4 border border-gray-200 rounded-md bg-white text-gray-700">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p>This is the dashboard page. You must be logged in to see it.</p>
        <p>Do you wanna pay me some money?</p>
        {checkoutButton}
      </div>
    </div>
  );
};

export default Dashboard;
