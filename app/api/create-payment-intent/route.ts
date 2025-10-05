import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export async function POST(request: NextRequest) {
  try {
    const { finalTotal } = await request.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalTotal,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    console.log("paymentIntent : ", paymentIntent)
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
