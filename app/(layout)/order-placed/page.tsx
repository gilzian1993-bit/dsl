'use client'
import useFormStore from '@/stores/FormStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import { fleets } from '../book-ride/CarList'
import { MdDone } from 'react-icons/md'
import Image from 'next/image'
import Link from 'next/link'

function Page() {
const { isOrderDone, formData, category, orderId }  = useFormStore()
const router = useRouter()
 const headerRef = useRef<HTMLDivElement | null>(null)

 const { fromLocation, toLocation, stops, duration } = formData;
  
  const locations = [
    fromLocation,
    ...stops,
  ].filter(Boolean);

  if(category==='hourly'){
    locations.push({...duration, value:duration.value + " Hours"})
  } else {
    locations.push(toLocation)
  }

  const selectedFleet = fleets.find((item)=>item.name===formData.car.value);

useEffect(()=>{
    if(!isOrderDone){
        router.replace('/')
        router.refresh()
    }
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
},[isOrderDone])

    return (
    <div className=' w-full bg-slate-100 flex flex-col min-h-[50vh]'>
        <div ref={headerRef} className='h-24 w-full bg-black'></div>

        <div className='max-w-5xl mx-auto py-16 lg:py-24 w-full flex items-center justify-center flex-col gap-6 lg:gap-12 text-center p-3'>
            
            <div className='w-full flex items-center justify-center flex-col gap-3 lg:gap-5'>
                <MdDone className='p-2 text-white bg-green-500 rounded-full ' size={45} />
            <div className='text-gray-800 '>Great choice, {formData.name.value}</div>
            <div className='text-black text-2xl lg:text-4xl font-bold'>YOUR RESERVATION IS CONFIRMED</div>
            <div className='text-gray-800'>We&apos;ve sent a confirmation email to {formData.email.value}</div>
            </div>

         <div className='w-full grid md:grid-cols-3 lg:gap-5'>
            <div className='lg:col-span-2 w-full  bg-white max-lg:rounded-b-xl max-lg:order-2 lg:rounded-l-xl border-2 border-gray-400 py-6 px-4 gap-8 flex flex-col justify-center text-start'>
              
              <div className='text-xl lg:text-2xl font-bold'>
                Your itinerary
              </div>

              <div className='flex  gap-3 w-full'>
                <div className='w-1 h-full py-2'>
                  <div className='w-full h-full bg-gray-600 rounded-full'></div>
                </div>
              <div className='flex flex-col gap-3 w-full'>
              {locations.map((item)=>{
                  return <div key={item.value} className='flex items-start gap-3 md:gap-5'>
                    {/* <LocateIcon className='text-lg md:text-2xl text-black' /> */}
                    <div className='max-lg:text-sm' >{item.value}</div>
                </div>
              })}
              </div>
              </div>

              <div className='flex flex-col gap-1'>
                <div className='text-gray-500' >Pickup Date & Time</div>
                <div>{formData.date.value} {formData.time.value}</div>
              </div>

              <div className='flex items-center justify-end w-full'>
                <div className='flex items-center gap-5'>

                {/* <Link className='bg-brand px-3 py-2 text-black w-fit rounded-md' href='/' >Home</Link> */}
                <Link className='bg-brand px-3 py-2 text-black font-semibold w-fit rounded-md' href={`/order/${orderId}`} >View Order Details</Link>
                </div>
              </div>

            </div>
            {selectedFleet && <div className='max-lg:rounded-t-xl lg:rounded-r-xl border-2 border-gray-400 p-4 gap-5 flex flex-col items-center justify-center bg-gray-200 max-lg:order-1 '>
               <Image src={selectedFleet.image} width={350} height={350} alt={selectedFleet.name} className='w-full object-contain' />
               <div className='font-bold'>{selectedFleet.name}</div>
            </div>}
         </div>

        </div>

    </div>
  )
}

export default Page