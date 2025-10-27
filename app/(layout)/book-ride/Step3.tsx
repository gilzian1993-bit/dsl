import {  LuggageIcon, User, Users, Mail, Plane } from 'lucide-react'
import React from 'react'
import {DetailsInput, PhoneInput} from './UserDetailInput'
import NewDateTimePicker from './NewDateTimePicker'
import useFormStore from '@/stores/FormStore'
import NewDropdownInput from './DropDownInput'
import { fleets } from './CarList'
import SelectableCheckbox from './SelectableCheckbox'
import AddReturn from './AddReturn'
import LoadingButton from './LoadingButton'

function Step3() {
    const {formData, setFormData, changeStep, formLoading} = useFormStore();
    const selectedFleet = fleets.find((item)=>item.name===formData.car.value)
    const passengersArray = Array.from(
  { length: selectedFleet?.passengers ?? 0 },
  (_, i) => {
    const count = i + 1
    return {
      label: `${count} ${count === 1 ? "Passenger" : "Passengers"}`,
      value: count.toString(),
    }
  }
)

const bagsArray = Array.from(
  { length: selectedFleet?.suitcases ?? 0 },
  (_, i) => {
    const count = i + 1
    return {
      label: `${count} ${count === 1 ? "Bag" : "Bags"}`,
      value: count.toString(),
    }
  }
)
  return (
    <div className='flex flex-col gap-5 w-full'>
        <div className='text-2xl'>Details</div>
        {/* max-lg:bg-gray-200 max-lg:px-2 max-lg:py-3 max-lg:rounded-md  */}
        <div className='flex flex-col gap-3 w-full  '>
            <DetailsInput field='name' placeholder='Passenger full name' Icon={User} type='text' />
            <PhoneInput/>
            <DetailsInput field='email' placeholder='Your email' Icon={Mail} type='email' />
            <NewDateTimePicker 
        selectedDate={formData.date.value}
        selectedTime={formData.time.value}
        setFormData={setFormData}
        dateFieldName="date"
        timeFieldName="time" 
         placeholder='Select Date & Time'
         isDisable={false}
        />
        <div className='grid grid-cols-2 gap-3' >
            <NewDropdownInput Icon={Users} fieldName='passengers' placeholder='No. of Passengers' options={passengersArray} />
            <NewDropdownInput Icon={LuggageIcon} fieldName='bags' placeholder='No. of Bags' options={bagsArray} />
        </div>
        <AddReturn/>
         {formData.isReturn.value && <NewDateTimePicker 
        selectedDate={formData.returnDate.value}
        selectedTime={formData.returnTime.value}
        setFormData={setFormData}
        dateFieldName="returnDate"
        minSelectableDate={new Date(formData.date.value)}
        isDisable={formData.date.value === '' ? true : false}
        timeFieldName="returnTime" placeholder='Select Return Date & Time'/>
        }

       <div className="w-full">
       <SelectableCheckbox fieldName='isAirportPickup' label='Airport Pickup Details' />

      <div className="w-full overflow-hidden transition-all duration-500"
       style={{ maxHeight: formData.isAirportPickup.value ? '200px' : '0' }}>
      <div className={`flex flex-col gap-3 pt-3 opacity-${formData.isAirportPickup.value ? '100' : '0'} transition-opacity duration-500`}>
      <DetailsInput field='flightName' placeholder='Airline Name' Icon={Plane} type='text' />
      <DetailsInput field='flightNumber' placeholder='Flight Number' Icon={Plane} type='text' />
      </div>
     </div>
    </div>

          <div className='font-bold'>Equipment and Extras</div>
        <SelectableCheckbox fieldName='isFlightTrack' label='Car Seats' subLabel='$ 10'  />
        <SelectableCheckbox fieldName='isMeetGreet' label='Meet & Greet' subLabel='$ 25'  />
        </div>
        {
          formLoading ? <LoadingButton/> :
         <div onClick={()=>{changeStep(true,3);}} className='p-2 rounded-lg border border-gray-200 w-full text-center text-black font-bold cursor-pointer bg-brand'>
                    Continue 
         </div>}
         <div onClick={()=>{changeStep(false,3);}} className='p-2 rounded-lg border border-gray-500 w-full text-center text-gray-700 font-semibold cursor-pointer'>
                    Back 
         </div>
    </div>
   )
}

export default Step3