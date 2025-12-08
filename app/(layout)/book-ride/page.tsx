'use client'
import useFormStore from '@/stores/FormStore'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HeroForm from './HeroForm'

function Page() {
  const { formData } = useFormStore()
  const router = useRouter()

  // Redirect to select-vehicle if form data exists (user already submitted initial form)
  useEffect(() => {
    const hasRequiredData = formData.fromLocation.value && 
      (formData.toLocation.value || formData.duration.value)
    
    if (hasRequiredData) {
      router.replace('/book-ride/select-vehicle')
      router.refresh()
    }
  }, [formData.fromLocation.value, formData.toLocation.value, formData.duration.value, router])

  return (
    <div className=' w-full bg-slate-50 flex flex-col min-h-[50vh]'>
      <div className='max-w-5xl mx-auto flex flex-col gap-5 lg:gap-10 w-full py-5 lg:py-16 px-2 '>
        <HeroForm/>
      </div>
    </div>
  )
}

export default Page