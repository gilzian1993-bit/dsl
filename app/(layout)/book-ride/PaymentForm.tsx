"use client"

import React, { useState, useEffect } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import ChipImage from "@/assets/new-form/cardchip.png"
import Secure1 from "@/assets/new-form/secure.png"
import Secure2 from "@/assets/new-form/securepay.png"
import { processStripePayment } from "@/app/actions/new-pyament-accept"
import useFormStore from "@/stores/FormStore"
import ContinueButton from "./ContinueButton"
import { useRouter } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")


function StripePaymentForm({price}:{price:string}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const {formError, setFormData, changeStep, formData, formLoading } = useFormStore()

  const amount = Number(price)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if(formData.paymentId.value && !formLoading){
      const isOk = await changeStep(true,4)
      if(isOk){
        router.replace('/order-placed')
        router.refresh()
      }
      return;
    }

    if (!stripe || !elements) return

    setError("")
    setLoading(true)

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (result.error) {
      setError(result.error.message || "Payment failed")
      setLoading(false)
      return
    }

    const paymentId = result.paymentIntent?.id
    if (paymentId) {
      const res = await processStripePayment({
        amount,
        paymentIntentId: paymentId,
      })

      if (!res.success || !res.paymentId ) {
        setError("Payment Failed")
        setLoading(false)
        return
      }

      setFormData("paymentId", res.paymentId)
      setLoading(false)
      const isOk = await changeStep(true,4)
      if(isOk){
        router.replace('/order-placed')
        router.refresh()
      }
    }
  }

  return (
    <div className=" w-full flex flex-col">
      {/* Header */}
      {/* <div className="w-full flex justify-center bg-white p-2 rounded-t-lg">
        <Image
          src="/secured-by-stripe.jpg"
          alt="Secured by Stripe"
          width={200}
          height={150}
          className="object-contain w-full h-full"
        />
      </div> */}

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid lg:grid-cols-2 gap-5 w-full">

        {formData.paymentId.value ? <div className="px-8 py-20 text-center bg-white rounded-lg shadow-sm  ">
          <div className="text-green-600 text-xl font-semibold ">
            Payment Done
          </div>
          <div className="text-gray-500 text-sm">
            If you get any error please take screen shot and send on our whatsapp.
          </div>

        </div> :  <div className="p-2 bg-gray-200 lg:bg-white rounded-lg shadow-sm flex flex-col gap-3 ">
          <PaymentElement  />
         
        </div>}
        <div className='flex flex-col gap-5 w-full max-lg:hidden'>
                <div className='w-full rounded-xl bg-black flex flex-col gap-8 p-5'>
                  <Image src={ChipImage} alt='card chip' className='w-12' />
                  <div className='flex items-center gap-5 text-gray-500 text-xl'>
                    {Array.from({length:4},(_,i)=><div key={i} className=''>****</div>)}
                  </div>
                  <div className='flex items-center justify-between text-gray-500 '>
                     <div className='text-xl'>{formData.name.value}</div>
                     <div className='flex flex-col text-sm text-center'>
                        <div className=''>
                           valid thru
                        </div>
                        <div className=''>
                           **/**
                        </div>
                     </div>
                  </div>
                </div>
                <div className='flex items-center justify-between gap-5'>
                <Image src={Secure1} alt='secure 1' className='' />
                <Image src={Secure2} alt='secure 2' className='' />
                </div>
            </div>
        
</div>
        <div className="text-[12px] lg:text-xs text-justify">Please note after you have confirmed your reservation you will be sent a full booking confirmation. You can amend your journey at any time. Free cancellation within 24 hours. All bookings are subject to our Terms and Conditions. </div>
        {formError && <div className="text-red-500 text-center">{formError}</div>}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {/* Pay Button */}
        <ContinueButton title="Proceed Payment" loading={loading} type="submit" step={4} />
      </form>
    </div>
  )
}

function MyPaymentForm({price}:{price:string}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  
  
  const amount =  Number(price) 
  console.log('amount : ',amount)

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        })

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Error fetching client secret:", error)
      }
    }

    fetchClientSecret()
  }, [amount])

  if (!clientSecret) {
    return (
      <div className="px-8 py-20 text-center bg-white rounded-lg shadow-sm animate-pulse text-xl font-semibold text-gray-500 ">
        Loading payment form...
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm price={price} />
    </Elements>
  )
}

export default MyPaymentForm