import useFormStore from '@/stores/FormStore';
import { Loader } from 'lucide-react';
import React from 'react'

function ContinueButton({title, loading , type, step}:{title:string, loading?:boolean, type:'submit'|'button', step:number}) {
    const {changeStep, formLoading} = useFormStore()
    const isLoading = formLoading || loading;
    
  return (
    <button 
      type={type} 
      onClick={()=>{if(type === 'button') changeStep(true,step); }} 
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 w-full p-2 rounded-lg cursor-pointer font-semibold transition-colors ${
        isLoading 
          ? 'bg-blue-500 text-white cursor-not-allowed' 
          : 'bg-brand text-black hover:bg-[#0294a4]'
      } disabled:opacity-70`}
    >
      <Loader className={`animate-spin ${isLoading ? '' : 'hidden'}`} size={20} />
      {isLoading ? 'Loading' : title}
    </button>
  )
}

export default ContinueButton