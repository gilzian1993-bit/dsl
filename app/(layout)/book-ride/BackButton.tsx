import useFormStore from '@/stores/FormStore';
import React from 'react'

function BackButton({step}:{step:number}) {
    const {changeStep} = useFormStore()
  return (
    <div onClick={()=>{changeStep(false, step); }} className='p-2 rounded-lg border border-gray-500 w-full text-center text-gray-700 font-semibold cursor-pointer'>
                    Back 
         </div>
  )
}

export default BackButton