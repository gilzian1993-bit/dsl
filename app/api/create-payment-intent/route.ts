import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-08-27.basil", 
});

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()
    const centsAmount = Math.round(amount * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: centsAmount, 
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Error creating payment intent" }, { status: 500 })
  }
}