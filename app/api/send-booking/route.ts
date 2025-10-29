import { NextResponse } from "next/server";
import { sendBookingEmail, BookingData } from "@/lib/sendBookingEmail"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const booking: BookingData = body;

    // Validate required fields
    console.log("booking : ",booking)
    if (!booking.name || !booking.email || !booking.payment_id) {
      console.log('missing')
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const result = await sendBookingEmail(booking);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ API error:", error);
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
