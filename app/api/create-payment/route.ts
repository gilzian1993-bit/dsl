import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
      payment_method_options: {
        card: {
          setup_future_usage: null,
        },
      },

    });
    console.log("paymentIntent : ",paymentIntent)
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
