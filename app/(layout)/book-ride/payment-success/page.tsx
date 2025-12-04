'use client'
import useFormStore from '@/stores/FormStore'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { Loader } from 'lucide-react'

function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { formData, setFormData, changeStep, formLoading, formError, changeCategory } = useFormStore()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return
    hasProcessed.current = true

    const processPayment = async () => {
      const sessionId = searchParams.get('session_id')

      if (!sessionId) {
        setError('No session ID found. Please contact support if payment was completed.')
        setIsProcessing(false)
        return
      }

      try {
        // Retrieve the checkout session from Stripe
        const response = await fetch(`/api/retrieve-checkout-session?session_id=${sessionId}`)
        const data = await response.json()

        console.log('Checkout session data:', data)

        if (!data.success || !data.paymentIntentId) {
          const errorMsg = data.error || 'Failed to retrieve payment information'
          console.error('Failed to retrieve payment:', errorMsg)
          setError(errorMsg)
          setIsProcessing(false)
          return
        }

        // Restore form data from Stripe metadata if available
        if (data.formData) {
          console.log('Restoring form data from Stripe metadata...')
          const restoredData = data.formData
          
          // Restore all form fields
          if (restoredData.name) setFormData('name', restoredData.name)
          if (restoredData.email) setFormData('email', restoredData.email)
          if (restoredData.phone) setFormData('phone', restoredData.phone)
          if (restoredData.fromLocation) setFormData('fromLocation', restoredData.fromLocation)
          if (restoredData.toLocation) setFormData('toLocation', restoredData.toLocation)
          if (restoredData.date) setFormData('date', restoredData.date)
          if (restoredData.time) setFormData('time', restoredData.time)
          if (restoredData.returnDate) setFormData('returnDate', restoredData.returnDate)
          if (restoredData.returnTime) setFormData('returnTime', restoredData.returnTime)
          if (restoredData.passengers) setFormData('passengers', restoredData.passengers)
          if (restoredData.bags) setFormData('bags', restoredData.bags)
          if (restoredData.flightName) setFormData('flightName', restoredData.flightName)
          if (restoredData.flightNumber) setFormData('flightNumber', restoredData.flightNumber)
          if (restoredData.car) setFormData('car', restoredData.car)
          if (restoredData.rearSeat !== undefined) setFormData('rearSeat', restoredData.rearSeat)
          if (restoredData.boosterSeat !== undefined) setFormData('boosterSeat', restoredData.boosterSeat)
          if (restoredData.infantSeat !== undefined) setFormData('infantSeat', restoredData.infantSeat)
          if (restoredData.returnRearSeat !== undefined) setFormData('returnRearSeat', restoredData.returnRearSeat)
          if (restoredData.returnBoosterSeat !== undefined) setFormData('returnBoosterSeat', restoredData.returnBoosterSeat)
          if (restoredData.returnInfantSeat !== undefined) setFormData('returnInfantSeat', restoredData.returnInfantSeat)
          if (restoredData.isAirportPickup !== undefined) setFormData('isAirportPickup', restoredData.isAirportPickup)
          if (restoredData.isMeetGreet !== undefined) setFormData('isMeetGreet', restoredData.isMeetGreet)
          if (restoredData.isReturnMeetGreet !== undefined) setFormData('isReturnMeetGreet', restoredData.isReturnMeetGreet)
          if (restoredData.isReturn !== undefined) setFormData('isReturn', restoredData.isReturn)
          if (restoredData.basePrice !== undefined) setFormData('basePrice', restoredData.basePrice)
          if (restoredData.graduatiy !== undefined) setFormData('graduatiy', restoredData.graduatiy)
          if (restoredData.tax !== undefined) setFormData('tax', restoredData.tax)
          if (restoredData.discount !== undefined) setFormData('discount', restoredData.discount)
          if (restoredData.isAirportPickupPrice !== undefined) setFormData('isAirportPickupPrice', restoredData.isAirportPickupPrice)
          if (restoredData.isMeetGreetPrice !== undefined) setFormData('isMeetGreetPrice', restoredData.isMeetGreetPrice)
          if (restoredData.rearSeatPrice !== undefined) setFormData('rearSeatPrice', restoredData.rearSeatPrice)
          if (restoredData.infantSeatPrice !== undefined) setFormData('infantSeatPrice', restoredData.infantSeatPrice)
          if (restoredData.boosterSeatPrice !== undefined) setFormData('boosterSeatPrice', restoredData.boosterSeatPrice)
          if (restoredData.returnPrice !== undefined) setFormData('returnPrice', restoredData.returnPrice)
          if (restoredData.isReturnMeetGreetPrice !== undefined) setFormData('isReturnMeetGreetPrice', restoredData.isReturnMeetGreetPrice)
          if (restoredData.returnRearSeatPrice !== undefined) setFormData('returnRearSeatPrice', restoredData.returnRearSeatPrice)
          if (restoredData.returnInfantSeatPrice !== undefined) setFormData('returnInfantSeatPrice', restoredData.returnInfantSeatPrice)
          if (restoredData.returnBoosterSeatPrice !== undefined) setFormData('returnBoosterSeatPrice', restoredData.returnBoosterSeatPrice)
          if (restoredData.stopsPrice !== undefined) setFormData('stopsPrice', restoredData.stopsPrice)
          if (restoredData.totalPrice !== undefined) setFormData('totalPrice', restoredData.totalPrice)
          if (restoredData.distance !== undefined) setFormData('distance', restoredData.distance)
          if (restoredData.duration) setFormData('duration', restoredData.duration)
          
          // Restore category if available
          if (restoredData.category && changeCategory) {
            changeCategory(restoredData.category as "trip" | "hourly")
          }
          
          // Restore stops
          if (Array.isArray(restoredData.stops)) {
            restoredData.stops.forEach((stop: string, index: number) => {
              if (stop) {
                setFormData('stops', stop, '', index)
              }
            })
          }
          
          console.log('Form data restored from metadata')
        }

        // Store payment ID in form data
        setFormData('paymentId', data.paymentIntentId)
        console.log('Payment ID set:', data.paymentIntentId)

        // Wait a bit to ensure state is updated, then get fresh state
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Get fresh formData from store
        const store = useFormStore.getState()
        const currentFormData = store.formData

        // Verify required form data is present
        if (!currentFormData.name.value || !currentFormData.email.value || !currentFormData.car.value) {
          console.error('Missing required form data:', {
            name: currentFormData.name.value,
            email: currentFormData.email.value,
            car: currentFormData.car.value,
            paymentId: currentFormData.paymentId.value,
            hasFormDataFromMetadata: !!data.formData
          })
          setError('Missing required booking information. Your payment was successful, but we need your booking details. Please contact support with your payment ID: ' + data.paymentIntentId)
          setIsProcessing(false)
          return
        }

        console.log('Form data verified. Proceeding with booking...')

        // Complete the booking by calling changeStep
        console.log('Calling changeStep to complete booking...')
        const isOk = await changeStep(true, 4)
        
        console.log('changeStep result:', isOk)
        
        if (isOk) {
          router.replace('/order-placed')
          router.refresh()
        } else {
          // Wait a moment for formError to be set, then check it
          await new Promise(resolve => setTimeout(resolve, 200))
          const currentStore = useFormStore.getState()
          const currentFormError = currentStore.formError
          // Use formError from store if available, otherwise use generic message
          const errorMessage = currentFormError || formError || 'Failed to complete booking'
          console.error('Booking failed:', errorMessage, 'Form error:', currentFormError)
          setError(errorMessage)
          setIsProcessing(false)
        }
      } catch (err) {
        console.error('Error processing payment:', err)
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your payment'
        setError(errorMessage)
        setIsProcessing(false)
      }
    }

    processPayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isProcessing || formLoading) {
    return (
      <div className='w-full bg-slate-50 flex flex-col min-h-[50vh] items-center justify-center py-16'>
        <div className='flex flex-col items-center gap-4'>
          <Loader className="animate-spin" size={40} />
          <div className='text-xl font-semibold'>Processing your payment...</div>
          <div className='text-gray-600'>Please wait while we confirm your payment and complete your booking.</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-full bg-slate-50 flex flex-col min-h-[50vh] items-center justify-center py-16 px-4'>
        <div className='flex flex-col items-center gap-4 max-w-md text-center'>
          <div className='text-red-600 text-xl font-semibold'>Payment Processing Error</div>
          <div className='text-gray-600'>{error}</div>
          <button
            onClick={() => router.push('/book-ride/passenger-details')}
            className='mt-4 px-6 py-2 bg-brand text-black font-semibold rounded-lg hover:bg-[#0294a4] transition-colors'
          >
            Go Back to Payment
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default PaymentSuccessPage

