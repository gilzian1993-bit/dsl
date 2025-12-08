import React from 'react'
import { useRouter, usePathname } from 'next/navigation'

function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = () => {
    if (pathname === '/book-ride/confirm-payment') {
      router.push('/book-ride/passenger-details')
    } else if (pathname === '/book-ride/passenger-details') {
      router.push('/book-ride/select-vehicle')
    } else {
      router.back()
    }
  }

  return (
    <div onClick={handleBack} className='p-2 rounded-lg border border-gray-500 w-full text-center text-gray-700 font-semibold cursor-pointer'>
      Back 
    </div>
  )
}

export default BackButton