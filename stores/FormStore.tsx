'use client';

import { calculateDistance } from "@/app/actions/getDistance";
import { hourlyInitialFormData, tripInitialFormData } from "@/constants/storeInitailObjects";
import { create } from "zustand";

  export interface FieldType<T> {
  value: T;
  error: string;
  coardinates: string;
  coardinatesRequired: boolean;
  required: boolean;
  step: number;
  }

 export interface FormDataType {
  fromLocation: FieldType<string>;
  toLocation: FieldType<string>;
  stops: FieldType<string>[];
  duration: FieldType<string>;
  distance: FieldType<number>;
  car: FieldType<string>;
  name: FieldType<string>;
  phone: FieldType<string>;
  email: FieldType<string>;
  date: FieldType<string>;
  time: FieldType<string>;
  returnDate: FieldType<string>;
  returnTime: FieldType<string>;
  passengers: FieldType<string>;
  bags: FieldType<string>;
  flightName: FieldType<string>;
  flightNumber: FieldType<string>;
  paymentId: FieldType<string>;

  // Seats and Add-ons
  rearSeat: FieldType<number>;
  boosterSeat: FieldType<number>;
  infantSeat: FieldType<number>;
  returnRearSeat: FieldType<number>;
  returnBoosterSeat: FieldType<number>;
  returnInfantSeat: FieldType<number>;

  // Boolean options
  isAirportPickup: FieldType<boolean>;
  isFlightTrack: FieldType<boolean>;
  isMeetGreet: FieldType<boolean>;
  isReturnMeetGreet: FieldType<boolean>;
  isReturn: FieldType<boolean>;

  // Computed fields
  basePrice: FieldType<number>;
  graduatiy: FieldType<number>;
  tax: FieldType<number>;
  discount: FieldType<number>;
  isAirportPickupPrice: FieldType<number>;
  isMeetGreetPrice: FieldType<number>;
  rearSeatPrice: FieldType<number>;
  infantSeatPrice: FieldType<number>;
  boosterSeatPrice: FieldType<number>;
  returnPrice: FieldType<number>;
  isReturnMeetGreetPrice: FieldType<number>;
  returnRearSeatPrice: FieldType<number>;
  returnInfantSeatPrice: FieldType<number>;
  returnBoosterSeatPrice: FieldType<number>;
  totalPrice: FieldType<number>;
}


  interface FormStoreType {
  step: number;
  isMobileDropdownOpen: boolean;
  category: "trip" | "hourly";
  formError: string;
  orderId: string;
  isOrderDone: boolean;
  formLoading: boolean;
  formData: FormDataType;
  setFormData: (
    key: keyof FormDataType | "stops",
    value: string | boolean | number,
    coardinates?: string,
    index?: number
  ) => void;
  setFieldOptions: (
    key: keyof FormDataType | "stops",
    required:  boolean ,
   
  ) => void;
  validateData: ( _step:number) => boolean;
  changeStep: (isNext: boolean, _step:number) => Promise<boolean>;
  changeCategory: (newCategory: "trip" | "hourly") => void;
  manageStops: (action: "add" | "remove", index?: number) => void;
  toggleMobileDropdown: () => void;
  calculatePrices: () => void;
  resetForm: () => void;
  }

  const makeStop = (required = false): FieldType<string> => ({
  value: "",
  coardinates: "",
  error: "",
  required,
  coardinatesRequired: required,
  step: 1,
  });



  const useFormStore = create<FormStoreType>((set, get) => ({
  step: 1,
  isMobileDropdownOpen: false,
  category: "trip",
  formError: "",
  formLoading: false,
  formData: tripInitialFormData,
  isOrderDone: false,
  orderId:'',
  setFormData: (key, value, coardinates = "", index) => {
    const {calculatePrices} = get()
    
    if (key === "stops" && typeof index === "number") {
      set((state) => {
        const stops = [...state.formData.stops];
        stops[index] = { ...stops[index], value: value as string, coardinates, error:'' };
        return { formData: { ...state.formData, stops } };
      });
      calculatePrices()
      return;
    }
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: { ...state.formData[key as keyof FormDataType], value, coardinates, error:''  },
      },
    }));
     calculatePrices();
  },
  setFieldOptions: (key, required) => {
    if(key==='stops') return;
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: { ...state.formData[key as keyof FormDataType], error:'', required  },
      },
    }));
  },

  validateData: (_step:number) => {
    const { formData } = get();

    // Validate all fields (including dynamic stops)
    const updated: FormDataType = { ...formData };

    // validate simple fields
    (Object.keys(formData) as (keyof FormDataType)[]).forEach((k) => {
      if (k === "stops") return;
      const item = formData[k] as FieldType<string>;
      const hasErr = item.step === _step && item.required && !item.value && Number(item.value) !== 0 ;
      const hasErr2 = item.step === _step && item.coardinatesRequired && !item.coardinates;
      (updated[k] as FieldType<string>) = { ...item, error: hasErr ? `${k} is required` : hasErr2 ? `${k} coordinates required` : "" };
    });

    // validate stops
    const stopsUpdated = formData.stops.map((s) => {
      const hasErr = s.step === _step && s.required && !s.value;
      const hasErr2 = s.step === _step && s.coardinatesRequired && !s.coardinates;
      return { ...s, error: hasErr ? `stop is required` : hasErr2 ? `stop coordinates required` : "" };
    });

    updated.stops = stopsUpdated;
    console.log("updated ",updated)

    set({ formData: updated  });

   
    const anyErrorField = Object.values(updated as FormDataType).some((v) => {
      if (Array.isArray(v)) {
        return v.some((s) => s.error!=='');
      }
      return v.error !== '';
    });

    return anyErrorField;
  },

  changeStep: async (isNext: boolean, _step:number) => {
    const { formData, category, validateData } = get();
    if (!isNext) {
      set((state) => ({
        ...state,
        step: isNext ? _step + 1 : Math.max(1, _step - 1),
      }));
      return true;
    }

    set((state) => ({ ...state, formError: "", formLoading: true }));


    if (validateData(_step)) {
      console.log("not validate ",formData)
      set((state) => ({ ...state, formError: "", formLoading: false }));
      return false;
    }
    
    console.log("validate")
    if (_step === 1 && category === "trip") {
      try {
        const stopsCoords = formData.stops.map((s) => s.coardinates);
        const distanceResponse = await calculateDistance({
          from: formData.fromLocation.coardinates,
          to: formData.toLocation.coardinates,
          stops: stopsCoords, 
        } as any);
        console.log("distanceResponse ",distanceResponse)
        if (distanceResponse.status !== 200) {
          set((state) => ({ ...state, formError: distanceResponse.error ?? "route not found", formLoading: false }));
          return false;
        }
        set((state) => ({
          ...state,
          formData: { ...state.formData, distance: { ...state.formData.distance, value: distanceResponse?.mileDistance ?? 0 } },
        }));
      } catch (error) {
        set((state) => ({
          ...state,
          formError: error instanceof Error ? error.message : "route not found",
          formLoading: false,
        }));
        return false;
      }
    }

    if (_step === 4) {
  const { formData } = get();

  const original = Object.entries(formData).reduce<Record<string, string[] |string| number | boolean>>((acc, [key, item]) => {
    if (key === "stops") {
      acc.stops = formData.stops.map((s) => s.value);
    } else {
      acc[key] = (item as FieldType<string>).value;
    }
    return acc;
  }, {});

  try {
    const newObject = {
      // 🔹 Basic Info
      payment_id: original.paymentId ,
      name: original.name,
      email: original.email,
      phone_number: original.phone,

      // 🔹 Route Info
      from_location: original.fromLocation,
      to_location: original.toLocation,
      stops: original.stops ?? [],
      pickup_date: original.date,
      pickup_time: original.time,
      return_date: original.returnDate,
      return_time: original.returnTime,

      // 🔹 Passenger Info
      passengers: original.passengers,
      luggage: original.bags,

      // 🔹 Flight Info
      flight_number: original.flightNumber,
      airline_code: original.flightName || "",
      return_flight_number: "",
      return_airline_code: "",

      // 🔹 Car & Trip Info
      car_type: original.car,
      returnTrip: original.isReturn,
      tripType: original.isReturn ? "return" : "oneway",
      hours: original.duration || "",
      distance: original.distance || 0,

      // 🔹 Seats
      rear_seats: original.rearSeat,
      booster_seats: original.boosterSeat,
      infantSeat: original.infantSeat,
      return_rear_seats: original.returnRearSeat,
      return_booster_seats: original.returnBoosterSeat,
      return_infantSeat: original.returnInfantSeat,

      // 🔹 Meet & Greet
      meetGreet: original.isMeetGreet,
      returnMeetGreet: original.isReturnMeetGreet,

      // 🔹 Pricing (all computed and extra prices)
      base_price: original.basePrice,
      gratuity: original.graduatiy,
      tax: original.tax,
      discount: original.discount,
      isMeetGreetPrice: original.isMeetGreetPrice,
      rearSeatPrice: original.rearSeatPrice,
      infantSeatPrice: original.infantSeatPrice,
      boosterSeatPrice: original.boosterSeatPrice,
      returnPrice: original.returnPrice,
      isReturnMeetGreetPrice: original.isReturnMeetGreetPrice,
      returnRearSeatPrice: original.returnRearSeatPrice,
      returnInfantSeatPrice: original.returnInfantSeatPrice,
      returnBoosterSeatPrice: original.returnBoosterSeatPrice,
      totalPrice: original.totalPrice,

      // 🔹 Optional flags
      isAirportPickup: original.isAirportPickup,
      isFlightTrack: original.isFlightTrack,
      category
    };

    console.log("🚀 Sending booking payload:", newObject);

    const response = await fetch('/api/send-booking',{method:'POST', body:JSON.stringify(newObject)})
     const res = await response.json()


    if (!res.success) {
      set({ formError: res.message ?? "Booking failed", formLoading: false });
      return false;
    }

    // Success ✅
    set({
      formError: "",
      formLoading: false,
    });

  } catch (error) {
    set({
      formError: error instanceof Error ? error.message : "Failed to place order",
      formLoading: false,
    });
    return false;
  }
}

    if(_step===4 && isNext){
      set((state) => ({ ...state, formError: "", formLoading: false, step: 1, isOrderDone:true }));
      return true;
    }
    console.log("working fine : ",_step)
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("working fine 2 : ",_step)
    set((state) => ({ ...state, formError: "", formLoading: false, step: isNext ? _step + 1 : Math.max(1, _step - 1) }));
    return true; 
  },

  changeCategory: (newCategory) => {
    const { category } = get();
    if (category === newCategory) return;
    if (newCategory === "trip") {
      set({ formData: tripInitialFormData, step: 1, category: "trip", formError: "", formLoading: false });
    } else {
      set({ formData: hourlyInitialFormData, step: 1, category: "hourly", formError: "", formLoading: false });
    }
  },

  manageStops: (action, index) => {
    const { formData } = get();
    if (action === "add") {
      set((state) => ({ ...state, formData: { ...state.formData, stops: [...state.formData.stops.slice(0,index), makeStop(true), ...state.formData.stops.slice(index,state.formData.stops.length ),] } }));
      return;
    }
    if (action === "remove" && typeof index === "number") {
      const stops = [...formData.stops];
      stops.splice(index, 1);
      set((state) => ({ ...state, formData: { ...state.formData, stops } }));
    }
  },

  toggleMobileDropdown:()=>{
    set((state)=>({...state, isMobileDropdownOpen:!state.isMobileDropdownOpen}))
  },
  calculatePrices: () => {
  set((state) => {
    const { formData } = state;

    const basePrice = formData.basePrice.value;
    const returnPrice = formData.isReturn.value ? basePrice - ((basePrice / 100) * 5) : 0;
    const graduatiy = ((basePrice + returnPrice)/100) * 20;
    const tax = ((basePrice + returnPrice)/100) * 5;
    const discount = ((basePrice + returnPrice)/100) * 5;
    const isMeetGreetPrice = formData.isMeetGreet.value ? 25 : 0;
    const rearSeatPrice = formData.rearSeat.value * 10;
    const infantSeatPrice = formData.infantSeat.value * 10;
    const boosterSeatPrice = formData.boosterSeat.value * 10;
    const isReturnMeetGreetPrice = formData.isReturnMeetGreet.value ? 25 : 0;
    const returnRearSeatPrice = formData.returnRearSeat.value * 10;
    const returnInfantSeatPrice = formData.returnInfantSeat.value * 10;
    const returnBoosterSeatPrice = formData.returnBoosterSeat.value * 10;
    const isAirportPickupPrice = formData.isAirportPickup.value ? 5 : 0 ;

    const totalPrice =
      basePrice +
      graduatiy +
      tax +
      isMeetGreetPrice +
      rearSeatPrice +
      infantSeatPrice +
      boosterSeatPrice +
      returnPrice +
      returnBoosterSeatPrice +
      returnInfantSeatPrice +
      returnRearSeatPrice + 
      isAirportPickupPrice +
      isReturnMeetGreetPrice -
      discount;

    return {
      formData: {
        ...formData,
        basePrice: { ...formData.basePrice, value: basePrice },
        graduatiy: { ...formData.graduatiy, value: graduatiy },
        tax: { ...formData.tax, value: tax },
        isAirportPickupPrice: { ...formData.isAirportPickupPrice, value: isAirportPickupPrice },
        discount: { ...formData.discount, value: discount },
        isMeetGreetPrice: { ...formData.isMeetGreetPrice, value: isMeetGreetPrice },
        rearSeatPrice: { ...formData.rearSeatPrice, value: rearSeatPrice },
        infantSeatPrice: { ...formData.infantSeatPrice, value: infantSeatPrice },
        boosterSeatPrice: { ...formData.boosterSeatPrice, value: boosterSeatPrice },
        returnPrice: { ...formData.returnPrice, value: returnPrice },
        isReturnMeetGreetPrice: { ...formData.isReturnMeetGreetPrice, value: isReturnMeetGreetPrice },
        returnRearSeatPrice: { ...formData.returnRearSeatPrice, value: returnRearSeatPrice },
        returnInfantSeatPrice: { ...formData.returnInfantSeatPrice, value: returnInfantSeatPrice },
        returnBoosterSeatPrice: { ...formData.returnBoosterSeatPrice, value: returnBoosterSeatPrice },
        totalPrice: { ...formData.totalPrice, value: totalPrice },
      },
    };
  });
},
  resetForm: () => set({ formData: tripInitialFormData, step: 1, category: "trip", formError: "", formLoading: false, isMobileDropdownOpen:false, isOrderDone:false, orderId:'' }),
  }));

export default useFormStore;