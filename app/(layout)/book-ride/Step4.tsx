import useFormStore from '@/stores/FormStore'
import React from 'react'
import MyPaymentForm from './PaymentForm'
import BackButton from './BackButton'

function Step4() {
    
    const { formData } = useFormStore()
    const basePrice = Number(formData.price.value ?? 0)
    const returnPrice = formData.isReturn ?  basePrice - (basePrice / 10) : 0
    const totalPrice = (Number(formData.price.value) + (formData.isMeetGreet.value ? 15 : 0) + (formData.isFlightTrack.value ? 7 : 0) + returnPrice).toFixed(2)

  return (
    <div className='flex flex-col gap-5 w-full'>
        <div className='flex flex-col gap-6 w-full'>
             <div className='flex flex-col gap-5 w-full'>
                <div className='font-bold'>Price Breakdown</div>
                <div className='flex flex-col gap-2 w-full'>
                   <div className='flex items-center justify-between gap-2'>
                      <div className='text-sm text-gray-500'>Economy Sedan Transfer</div>
                      <div className='text-sm text-gray-500'>£ {formData.price.value} </div>
                   </div>
                   {formData.isMeetGreet.value && <div className='flex items-center justify-between gap-2'>
                      <div className='text-sm text-gray-500'>Meet & Greet</div>
                      <div className='text-sm text-gray-500'>£ 15</div>
                   </div>}
                   {formData.isFlightTrack.value && <div className='flex items-center justify-between gap-2'>
                      <div className='text-sm text-gray-500'>Flight Track</div>
                      <div className='text-sm text-gray-500'>£ 7</div>
                   </div>}
                   {returnPrice > 0 && <div className='flex items-center justify-between gap-2'>
                      <div className='text-sm text-gray-500'>Return Transfer</div>
                      <div className='text-sm text-gray-500'>£ {returnPrice}</div>
                   </div>}
                  
                </div>
             </div>
             <div className='flex items-center justify-between gap-2 pt-2 border-t-2 border-black border-dashed text-2xl font-bold text-black'>
                      <div className=' '>Total:</div>
                      <div className=' '>£ {totalPrice} </div>
             </div>
        </div>
            <MyPaymentForm price={totalPrice}/>
      
        <BackButton step={4}/>
    </div>
  )
}

export default Step4