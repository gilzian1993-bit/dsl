'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ArrowLeft } from 'lucide-react'

function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className='w-full bg-slate-50 flex flex-col min-h-[50vh] items-center justify-center py-16 px-4'>
      <div className='flex flex-col items-center gap-6 max-w-md text-center'>
        <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-8 h-8 text-yellow-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
        </div>
        <div className='text-2xl font-bold text-gray-800'>Payment Cancelled</div>
        <div className='text-gray-600'>
          Your payment was cancelled. No charges have been made to your account.
        </div>
        <div className='text-gray-600'>
          You can return to complete your booking at any time.
        </div>
        <button
          onClick={() => router.push('/book-ride/passenger-details')}
          className='mt-4 px-6 py-3 bg-brand text-black font-semibold rounded-lg hover:bg-[#0294a4] transition-colors flex items-center gap-2'
        >
          <ArrowLeft size={20} />
          Return to Booking
        </button>
      </div>
    </div>
  )
}

export default PaymentCancelPage

