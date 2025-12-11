import {  LuggageIcon, User, Users, Mail, Plane, Loader, ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import {DetailsInput, PhoneInput} from './UserDetailInput'
import NewDateTimePicker from './NewDateTimePicker'
import useFormStore from '@/stores/FormStore'
import NewDropdownInput from './DropDownInput'
import { fleets } from './CarList'
import SelectableCheckbox from './SelectableCheckbox'
import AddReturn from './AddReturn'
import LoadingButton from './LoadingButton'
import ChildSeatSelector from './ChildSeatSelector'
import { useRouter } from 'next/navigation'

function Step3() {
    const {formData, setFormData, formLoading, validateData, category} = useFormStore();
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);
    const selectedFleet = fleets.find((item)=>item.name===formData.car.value)
    const passengersArray = Array.from(
  { length: (selectedFleet?.passengers  ?? 0) + 1 },
  (_, i) => {
    const count = i 
    return {
      label: `${count} ${count === 1 ? "Passenger" : "Passengers"}`,
      value: count.toString(),
    }
  }
)

const bagsArray = Array.from(
  { length: selectedFleet?.suitcases ? selectedFleet?.suitcases+1 : 0 },
  (_, i) => {
    const count = i 
    return {
      label: `${count} ${count === 1 ? "Bag" : "Bags"}`,
      value: count.toString(),
    }
  }
)

console.log("formData.date.value : ",formData.date.value)
console.log("formData.date.value !== '' ? false : true : ",formData.date.value !== '' ? false : true)

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
        <div className={`w-full ${formData.isReturn.value ? 'overflow-visible' : 'overflow-hidden'} transition-all duration-500`}
       style={{ maxHeight: formData.isReturn.value ? '200px' : '0' }}>
      <div className={`flex flex-col gap-3 pt-3 opacity-${formData.isReturn.value ? '100' : '0'} transition-opacity duration-500`}>
     <NewDateTimePicker 
        selectedDate={formData.returnDate.value}
        selectedTime={formData.returnTime.value}
        setFormData={setFormData}
        dateFieldName="returnDate"
        minSelectableDate={new Date(formData.date.value )}
        isDisable={formData.date.value === '' ? true : false}
        timeFieldName="returnTime" placeholder='Select Return Date & Time'/>
       </div>
       </div>
         

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
        <SelectableCheckbox fieldName='isMeetGreet' label='Meet & Greet' subLabel='$ 25'  />
        <div className="relative z-10">
          <ChildSeatSelector 
            rearSeatField='rearSeat'
            boosterSeatField='boosterSeat'
            infantSeatField='infantSeat'
          />
        </div>

<div className={`w-full transition-all duration-500 ${formData.isReturn.value ? 'overflow-visible' : 'overflow-hidden'}`}
       style={{ maxHeight: formData.isReturn.value ? '1000px' : '0' }}>
      <div className={`flex flex-col gap-3 pt-3 opacity-${formData.isReturn.value ? '100' : '0'} transition-opacity duration-500`}>
      <div className='font-bold'>Return Equipment and Extras</div>
        <SelectableCheckbox fieldName='isReturnMeetGreet' label='Meet & Greet' subLabel='$ 25'  />
        <div className="relative z-10">
          <ChildSeatSelector 
            rearSeatField='returnRearSeat'
            boosterSeatField='returnBoosterSeat'
            infantSeatField='returnInfantSeat'
          />
        </div>
       </div>
       </div>

        </div>
        <div className="relative z-0">
          {
            formLoading || isNavigating ? (
              <div className='p-2 rounded-lg border border-gray-200 w-full text-center text-white font-bold bg-blue-500 flex items-center justify-center gap-2'>
                <Loader className="animate-spin" size={20} />
                Loading
              </div>
            ) : (
              <div onClick={async ()=>{
                if(!validateData(3)){
                  setIsNavigating(true);
                  try {
                    // Prepare all form data to store in metadata
                    // Convert formData to a serializable format
                    const formDataForStorage = {
                      // Basic Info
                      name: formData.name.value,
                      email: formData.email.value,
                      phone: formData.phone.value,
                      
                      // Route Info
                      fromLocation: formData.fromLocation.value,
                      toLocation: formData.toLocation.value,
                      stops: formData.stops.map(s => s.value),
                      date: formData.date.value,
                      time: formData.time.value,
                      returnDate: formData.returnDate.value,
                      returnTime: formData.returnTime.value,
                      
                      // Passenger Info
                      passengers: formData.passengers.value,
                      bags: formData.bags.value,
                      
                      // Flight Info
                      flightName: formData.flightName.value,
                      flightNumber: formData.flightNumber.value,
                      
                      // Car Info
                      car: formData.car.value,
                      
                      // Seats
                      rearSeat: formData.rearSeat.value,
                      boosterSeat: formData.boosterSeat.value,
                      infantSeat: formData.infantSeat.value,
                      returnRearSeat: formData.returnRearSeat.value,
                      returnBoosterSeat: formData.returnBoosterSeat.value,
                      returnInfantSeat: formData.returnInfantSeat.value,
                      
                      // Options
                      isAirportPickup: formData.isAirportPickup.value,
                      isMeetGreet: formData.isMeetGreet.value,
                      isReturnMeetGreet: formData.isReturnMeetGreet.value,
                      isReturn: formData.isReturn.value,
                      
                      // Pricing
                      basePrice: formData.basePrice.value,
                      graduatiy: formData.graduatiy.value,
                      tax: formData.tax.value,
                      discount: formData.discount.value,
                      isAirportPickupPrice: formData.isAirportPickupPrice.value,
                      isMeetGreetPrice: formData.isMeetGreetPrice.value,
                      rearSeatPrice: formData.rearSeatPrice.value,
                      infantSeatPrice: formData.infantSeatPrice.value,
                      boosterSeatPrice: formData.boosterSeatPrice.value,
                      returnPrice: formData.returnPrice.value,
                      isReturnMeetGreetPrice: formData.isReturnMeetGreetPrice.value,
                      returnRearSeatPrice: formData.returnRearSeatPrice.value,
                      returnInfantSeatPrice: formData.returnInfantSeatPrice.value,
                      returnBoosterSeatPrice: formData.returnBoosterSeatPrice.value,
                      stopsPrice: formData.stopsPrice.value,
                      totalPrice: formData.totalPrice.value,
                      distance: formData.distance.value,
                      duration: formData.duration.value,
                      category: category, // Include category
                    };

                    // Create Stripe Checkout Session
                    const response = await fetch('/api/create-checkout-session', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        amount: formData.totalPrice.value,
                        formData: formDataForStorage, // Send all form data
                      }),
                    });

                    const data = await response.json();
                    
                    if (data.url) {
                      // Redirect to Stripe Checkout
                      window.location.href = data.url;
                    } else {
                      console.error('Failed to create checkout session:', data);
                      setIsNavigating(false);
                    }
                  } catch (error) {
                    console.error('Error creating checkout session:', error);
                    setIsNavigating(false);
                  }
                }
              }} className='p-2 rounded-lg border border-gray-200 w-full text-center text-black font-bold cursor-pointer bg-brand hover:bg-[#0294a4] transition-colors'>
                Process to Pay
              </div>
            )
          }
        </div>
    </div>
   )
}

export default Step3