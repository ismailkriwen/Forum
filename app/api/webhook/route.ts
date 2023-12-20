import { buffer } from "micro";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthSession } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (req: any) => {
  let event;

  try {
    const rawBody = await buffer(req);
    const signature = req.heades["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.log(err);
  }

  if (event?.type === "checkout.session.completed") {
    const session = await getAuthSession();

    if (session && session.user) {
      const user = await prisma.user.findFirst({
        where: { email: session.user.email },
        select: { balance: true, email: true },
      });
      if (user) {
        await prisma.user.update({
          where: {
            email: user.email!,
          },
          data: {
            balance: user.balance + 5,
          },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
};
