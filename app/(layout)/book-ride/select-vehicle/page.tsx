'use client'
import useFormStore from '@/stores/FormStore'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CarList from '../CarList'
import GoogleMapsRoute from '../GoogleMap'
import PickupTripDetails from '../PickupDetails'
import { ArrowDown, ArrowUp, ArrowLeft } from 'lucide-react'

function SelectVehiclePage() {
  const { isMobileDropdownOpen, toggleMobileDropdown, formData } = useFormStore()
  const router = useRouter()

  // Route guard: Check if fromLocation and toLocation exist
  useEffect(() => {
    const hasRequiredData = formData.fromLocation.value && 
      (formData.toLocation.value || formData.duration.value)
    
    if (!hasRequiredData) {
      router.replace('/')
      router.refresh()
      return
    }
  }, [formData.fromLocation.value, formData.toLocation.value, formData.duration.value, router])

  return (
    <div className=' w-full bg-slate-50 flex flex-col min-h-[50vh]'>
      <div className='max-w-5xl mx-auto flex flex-col gap-5 lg:gap-10 w-full py-5 lg:py-16 px-2 '>
        {/* Back Button - Top */}
        <button
          onClick={() => router.push('/')}
          className='flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-900 transition-colors self-start mb-2'
        >
          <ArrowLeft className='w-5 h-5' />
          <span>Back</span>
        </button>
        
        <div className={`w-full border-2 border-brand rounded-md flex flex-col lg:hidden ${isMobileDropdownOpen ? 'gap-5' : 'gap-0'}`}>
          <div className={`overflow-hidden transition-all duration-700 flex flex-col gap-3  ease-out
          ${isMobileDropdownOpen ? 'max-h-[2000px] opacity-100  p-1' : 'max-h-0 opacity-0 p-0' }
            `}>
            <GoogleMapsRoute/>
            <PickupTripDetails/>
          </div>
          <div onClick={()=>toggleMobileDropdown()} className='bg-brand p-2 rounded-sm font-bold flex items-center justify-between' >
            <div>Ride Details</div>
            {isMobileDropdownOpen ?   <ArrowUp/> : <ArrowDown/>}
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-5 w-full'>
          <div className='lg:col-span-2 w-full flex flex-col gap-5'>
            <CarList/>
          </div>
          <div className='hidden lg:flex flex-col gap-5 w-full'>
            <GoogleMapsRoute/>
            <PickupTripDetails/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectVehiclePage

