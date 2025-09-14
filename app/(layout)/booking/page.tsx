import BookingPageClient from '@/app/components/BookingPageClient';
import { Suspense } from 'react';
// import BookingClient from './BookingClient';

export default function Page() {
  return (
    <Suspense fallback={<p>Loading booking...</p>}>
      <BookingPageClient />
    </Suspense>
  );
}
