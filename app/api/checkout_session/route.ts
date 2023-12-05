const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: `{{PRICE_ID}}`,
        },
      ],
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json(err.message);
  }
};
