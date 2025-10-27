'use client'
import React, { useEffect } from 'react'
import useFormStore from '@/stores/FormStore'
import LocationInput from './LocationPicker'
import { Loader, TimerIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import NewDropdownInput from './DropDownInput'

function HeroForm() {
  const { category, changeCategory, formError, formLoading, changeStep, formData, manageStops, isOrderDone, step, resetForm } = useFormStore()

  const router = useRouter()
  const durationArray = Array.from({ length: 48 }, (_, i) => {
  const hours = (i + 1) / 2
  const label =
    hours === 0.5
      ? "0.5 Hour"
      : `${hours} ${hours === 1 ? "Hour" : "Hours"}`
  return { label, value: hours.toString() }
})

useEffect(()=>{
  if(isOrderDone){
    resetForm()
  }
},[step, isOrderDone])


  return (
    <div className='flex flex-col gap-3 sm:gap-5 w-full max-w-screen-sm'>
      <div className='grid grid-cols-3 lg:grid-cols-2 gap-5 max-lg:px-3 '>
        <div onClick={() => changeCategory('trip')} className={`p-2 w-full text-center font-semibold rounded-3xl cursor-pointer ${category==='trip' ? 'bg-brand' : 'bg-white'}`}>Trip</div>
        <div onClick={() => changeCategory('hourly')} className={`p-2 w-full text-center font-semibold rounded-3xl cursor-pointer ${category==='hourly' ? 'bg-brand' : 'bg-white'}`}>Hourly</div>
      </div>

      <div className='max-lg:px-3 max-lg:py-5 sm:p-5 rounded-2xl bg-white flex flex-col gap-5 border border-gray-300'>
        <div className='flex gap-3 items-start lg:max-h-[250px] lg:overflow-y-auto lg:p-1'>
          {/* Left: Inputs */}
          <div className='flex flex-col gap-4 lg:gap-5 w-full'>
           <LocationInput field="fromLocation" placeholder="Pickup Location" label='Start' />

      {category !== 'hourly' && formData.stops.map((_, i) => (
        <LocationInput
          key={i}
          field={`stops`}
          label={`Stop ${i+1}`}
          index={i}
          isStop
          placeholder={`Stop ${i + 1}`}
          onRemoveStop={() => manageStops('remove', i)}
          onAddStop={() => manageStops('add', i)}
          showAddButton
        />
      ))}

     {category !== 'hourly' && <LocationInput field="toLocation" placeholder="Drop Off Location" label='End' />}
     {category === 'hourly' && <NewDropdownInput Icon={TimerIcon} fieldName='duration' placeholder='Duration in Hours' options={durationArray} />}
          </div>

        
<div className={`w-6 flex flex-col items-center pt-[38px] ${category === 'trip' ? 'flex' : 'hidden'}`}>
  
  {(() => {
    const locationsCount = 2 + (formData.stops?.length ?? 0); 
    const nodes: React.ReactNode[] = [];

    for (let i = 0; i < locationsCount; i++) {
      const isStart = i === 0;
      const isEnd = i === locationsCount - 1;
      const stopIndex = i - 1; 
      
      nodes.push(
        <div key={`marker-${i}`} className="relative flex items-center justify-center">
          <div
            className={`relative rounded-full bg-white z-10 flex items-center justify-center
              ${isStart || isEnd ? 'border-[4px] border-gray-700 w-4 h-4' : 'border-[2px] border-gray-600 w-4 h-4'}`}
          >
       
            {!isStart && !isEnd && (
              <button
                onClick={() => manageStops('remove', stopIndex)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs leading-none text-gray-600 hover:text-red-500"
                title="Remove stop"
                aria-label={`Remove stop ${stopIndex + 1}`}
              >
                ×
              </button>
            )}
          </div>
        </div>
      );

   
      if (!isEnd) {
        nodes.push(
          <div key={`between-${i}`} className="flex flex-col items-center">
           
            <div className="w-px h-[18.5px] sm:h-[25px] border-l-[3px] border-dotted border-gray-300" />

           
            <button
              onClick={() => manageStops('add', i)}
              className="relative mt-1 mb-1 rounded-full border border-gray-400 w-4 h-4 flex items-center justify-center text-[12px] hover:bg-gray-100"
              title="Add stop"
              aria-label={`Add stop between ${i} and ${i + 1}`}
            >
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' >+</div>
            </button>

            
            <div className="w-px h-[18.5px] sm:h-[25px] border-l-[3px] border-dotted border-gray-300" />
          </div>
        );
      }
    }

    return nodes;
  })()}
</div>

        </div>

        {formError && <div className='text-sm text-red-500'>{formError}</div>}

        <div onClick={async() => { const isOk = await changeStep(true,1); console.log("ikOk",isOk); if(isOk){router.replace('/book-ride')}}} className={`flex items-center justify-center gap-2 w-full p-2 rounded-lg cursor-pointer font-semibold ${formLoading ? 'bg-blue-500 text-white' : 'bg-brand text-black '} `}>
          <Loader className={`animate-spin ${formLoading ? '' : 'hidden'}`} size={20} />
          {formLoading ? 'Loading' : 'Quote Now'}
        </div>
      </div>
    </div>
  )
}

export default HeroForm
