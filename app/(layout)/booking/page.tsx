import BookingPageClient from '@/app/components/BookingPageClient';
import { Suspense } from 'react';
// import BookingClient from './BookingClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[200px]">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
    </div>}>
      <BookingPageClient />
    </Suspense>
  );
}
