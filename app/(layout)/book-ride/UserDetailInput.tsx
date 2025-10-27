import useFormStore, { FormDataType } from '@/stores/FormStore';
import { LucideProps } from 'lucide-react'
import React from 'react'
import ReactPhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

interface DetailInputType {
    field: keyof FormDataType;
    placeholder: string;
    Icon : React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    type: 'number' | 'email' | 'text'

}

export function DetailsInput({field, placeholder, Icon, type}:DetailInputType) {
    const {formData, setFormData} = useFormStore()
  return (
    <div className={`p-2 rounded-md w-full border text-sm flex items-center gap-2 md:gap-5 bg-white ${!Array.isArray(formData[field]) && formData[field].error ? 'border-red-500' : 'border-gray-300'}`}>
           <Icon color='gray'/>
           <input type={type}  value={!Array.isArray(formData[field]) ? formData[field].value.toString() : ''} className='w-full focus:outline-none bg-transparent border-transparent' placeholder={placeholder} onChange={(e)=>setFormData(field, e.target.value)}  />
    </div>
  )
}
export function PhoneInput() {
    const {formData, setFormData} = useFormStore()
  return (
    <ReactPhoneInput
    country={'us'}
    value={formData.phone.value}
    onChange={phone => setFormData('phone', phone)}
    inputStyle={{
   width: '100%',                        
   paddingTop: '8px',                     
    paddingBottom: '8px',
    paddingLeft: '50px',
   paddingRight: '8px',
   fontSize: '14px',                      
   display: 'flex',                       
   alignItems: 'center',                  
   gap: '8px',                           
   backgroundColor: 'white',              
   border: formData.phone.error 
          ? '1px solid #f87171'          
          : '1px solid #d1d5db',         
   borderRadius: '6px'                   
    }}

buttonStyle={{
  border: formData.phone.error 
          ? '1px solid #f87171' 
          : '1px solid #d1d5db'
}}

    />
  )
}

