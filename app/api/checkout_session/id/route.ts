import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  const { id } = await req.json();

  try {
    const checkout_session = await stripe.checkout.sessions.retrieve(id);

    return NextResponse.json({ checkout_session });
  } catch (err) {
    console.log(err);
  }
};
