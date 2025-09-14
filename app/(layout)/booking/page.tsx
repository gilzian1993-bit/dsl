"use client"

import BookingPageClient from "@/app/components/BookingPageClient";


export default function BookingPage() {
  // This component can still be server-rendered
  // but the interactive part (searchParams) is moved to client
  return <BookingPageClient />;
}
