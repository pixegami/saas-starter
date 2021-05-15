import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";

interface DashboardProps {
  path: string;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [loading, setLoading] = React.useState(false);

  const redirectToCheckout = async (event) => {
    event.preventDefault();
    setLoading(true);

    const stripe = await loadStripe(
      "pk_test_aKOhvFXppSG39jKNDvVi3tYT006IbA5jQL"
    );

    const { error } = await stripe.redirectToCheckout({
      sessionId: "blah",
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
    <button disabled={loading} onClick={redirectToCheckout}>
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
