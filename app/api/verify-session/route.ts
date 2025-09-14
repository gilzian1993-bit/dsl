// app/api/verify-session/route.ts
import Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
})

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get("session_id")
  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)

    return NextResponse.json({
      paid: session.payment_status === "paid",
    })
  } catch (error) {
    console.error("Stripe verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment session" }, { status: 500 })
  }
}
