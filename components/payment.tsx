import { Button } from "@nextui-org/react";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export const paymentPage = () => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    console.log(query.get("success"), query.get("canceled"));
  }, []);

  return (
    <form action="/api/checkout_session" method="POST">
      <section className="bg-white w-[400px] h-[112px] rounded-[6px] flex flex-col justify-between">
        <Button type="submit" role="link">
          Checkout
        </Button>
      </section>
    </form>
  );
};
