import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const booking = body;

    console.log("📦 Incoming booking:", booking);

    // Validate required fields
    if (!booking?.name || !booking?.email || !booking?.payment_id) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // ✅ Lazy import to prevent Vercel build errors
    const { sendBookingEmail } = await import("@/lib/sendBookingEmail");

    // Send the booking email
    const result = await sendBookingEmail(booking);

    // If the email service failed
    if (!result?.success) {
      return NextResponse.json(result, { status: 500 });
    }

    // ✅ Return success
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ API error in /api/send-booking:", error);

    return NextResponse.json(
      {
        success: false,
        message: `Internal server error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}

// Optional (safeguard for GET requests)
export async function GET() {
  return NextResponse.json({
    success: false,
    message: "GET method not allowed on this route.",
  });
}
