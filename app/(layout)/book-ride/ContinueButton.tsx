import useFormStore from '@/stores/FormStore';
import { Loader } from 'lucide-react';
import React from 'react'

function ContinueButton({title, loading , type, step}:{title:string, loading?:boolean, type:'submit'|'button', step:number}) {
    const {changeStep, formLoading} = useFormStore()
  return (
    <button type={type} onClick={()=>{changeStep(true,step); }} className={`flex items-center justify-center gap-2 w-full p-2 rounded-lg cursor-pointer font-semibold ${formLoading || loading ? 'bg-blue-500 text-white' : 'bg-brand text-black '} `}>
                     <Loader className={`animate-spin ${formLoading || loading ? '' : 'hidden'}`} size={20} />
          {formLoading ? 'Loading' : title}
         </button>
  )
}

export default ContinueButton