import React from 'react'
import HeroForm from './HeroForm'
// import YearsImage from "@/assets/new-form/10years.png"
import Image from 'next/image'

function NewHeroSection() {
  return (
    <div className='relative '>
    <Image src='/header.png' width={1000} height={1000} alt='Background Image' className='absolute w-full h-[420px] lg:h-full left-0 right-0' />
    <div className='relative bg-black/40 w-full max-lg:rounded-b-3xl '>

    <div className='grid gap-6 lg:grid-cols-2 xl:grid-cols-3 pt-20 lg:py-48 lg:px-5 w-full overflow-hidden  max-w-screen-2xl mx-auto'>

    <div className='flex flex-col gap-2 md:gap-5 items-start justify-center h-full w-full xl:col-span-2 max-lg:px-3'>
        {/* <Image src={YearsImage} alt='Years image' className='w-16 lg:w-40' /> */}
         
      
      <div className='text-2xl font-semibold  lg:text-7xl lg::font-bold text-white'>The Best Fleet Service in NewYork</div>
      <div className='text-base lg:text-2xl text-white font-bold'>5% OFF on One Way & 10% OFF on Return</div>

          </div>
        
          <div className='flex items-center justify-center h-full w-full '>
         <HeroForm/>
          </div>
        </div>
    </div>
    </div>
  )
}

export default NewHeroSection