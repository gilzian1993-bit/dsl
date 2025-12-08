import { Loader } from 'lucide-react'
import React from 'react'

function LoadingButton() {
  return (
    <div className="bg-blue-500 text-white rounded-md p-1 md:px-4 md:py-2 transition-all max-md:text-base w-full flex justify-center items-center gap-1">
               <Loader className={`animate-spin `} size={20} />
               Loading
            </div>
  )
}

export default LoadingButton