import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-08-27.basil", 
});

export async function POST(request: NextRequest) {
  try {
    const { amount, formData } = await request.json()
    const centsAmount = Math.round(amount * 100)

    // Get the base URL for success and cancel URLs
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Store form data in metadata (Stripe metadata has 500 char limit per key, so we'll store as JSON string)
    // We'll split large data if needed, but for now store as single JSON string
    const formDataJson = JSON.stringify(formData || {})
    
    // Stripe metadata values must be strings and max 500 chars
    // If formData is too large, we'll need to split it, but let's try storing it
    // If it exceeds limit, we'll store in multiple keys
    const metadata: Record<string, string> = {}
    
    if (formDataJson.length <= 500) {
      metadata.formData = formDataJson
    } else {
      // Split into chunks if too large
      const chunks = Math.ceil(formDataJson.length / 500)
      for (let i = 0; i < chunks; i++) {
        const start = i * 500
        const end = start + 500
        metadata[`formData_${i}`] = formDataJson.substring(start, end)
      }
      metadata.formDataChunks = chunks.toString()
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Ride Booking',
              description: 'DSL Limo Service Booking',
            },
            unit_amount: centsAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/book-ride/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book-ride/payment-cancel`,
      metadata: metadata,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Error creating checkout session" }, 
      { status: 500 }
    )
  }
}

