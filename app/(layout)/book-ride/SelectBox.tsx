import React from 'react';
import useFormStore, { FormDataType } from '@/stores/FormStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface SeatSelectBoxType {
  field: keyof FormDataType;
  placeholder: string;
}

function SeatSelectBox({ field, placeholder }: SeatSelectBoxType) {
  const { formData, setFormData } = useFormStore();

  const fieldData = !Array.isArray(formData[field]) ? formData[field] : null;
  const value = fieldData?.value?.toString() || '';
  const error = fieldData?.error;

  return (<div className='flex flex-col '>
     <p className='text-sm'>{placeholder}</p>
    <Select
        value={value}
        onValueChange={(val) => setFormData(field, Number(val))}
      >
        <SelectTrigger
          className={`p-2 rounded-md w-full border flex items-center  gap-2 md:gap-5 bg-white ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
         <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">0 </SelectItem>
          <SelectItem value="1">1 </SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
        </SelectContent>
      </Select>
      </div>
  );
}

export default SeatSelectBox;
