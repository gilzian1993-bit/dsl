'use client'
import useFormStore from '@/stores/FormStore'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Step4 from '../Step4'
import PersonalDetails from '../PersonalDetails'
import PickupTripDetails from '../PickupDetails'
import SelectedCar from '../SelectedCar'
import { ArrowDown, ArrowUp } from 'lucide-react'

function ConfirmPaymentPage() {
  const { isMobileDropdownOpen, toggleMobileDropdown, formData } = useFormStore()
  const router = useRouter()

  // Route guard: Check if required passenger details are filled
  useEffect(() => {
    const hasRequiredData = formData.car.value && 
      formData.name.value && 
      formData.email.value && 
      formData.phone.value
    
    if (!hasRequiredData) {
      router.replace('/book-ride/passenger-details')
      router.refresh()
      return
    }
  }, [formData.car.value, formData.name.value, formData.email.value, formData.phone.value, router])

  return (
    <div className=' w-full bg-slate-50 flex flex-col min-h-[50vh]'>
      <div className='max-w-5xl mx-auto flex flex-col gap-5 lg:gap-10 w-full py-5 lg:py-16 px-2 '>
        <div className={`w-full border-2 border-brand rounded-md flex flex-col lg:hidden ${isMobileDropdownOpen ? 'gap-5' : 'gap-0'}`}>
          <div className={`overflow-hidden transition-all duration-700 flex flex-col gap-3  ease-out
          ${isMobileDropdownOpen ? 'max-h-[2000px] opacity-100  p-1' : 'max-h-0 opacity-0 p-0' }
            `}>
            <PickupTripDetails/>
            <SelectedCar/>
            <PersonalDetails/>
          </div>
          <div onClick={()=>toggleMobileDropdown()} className='bg-brand p-2 rounded-sm font-bold flex items-center justify-between' >
            <div>Ride Details</div>
            {isMobileDropdownOpen ?   <ArrowUp/> : <ArrowDown/>}
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-5 w-full'>
          <div className='lg:col-span-2 w-full flex flex-col gap-5'>
            <Step4/>
          </div>
          <div className='hidden lg:flex flex-col gap-5 w-full'>
            <PickupTripDetails/>
            <SelectedCar/>
            <PersonalDetails/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPaymentPage

