'use client';

import { calculateDistance } from "@/app/actions/getDistance";
import { hourlyInitialFormData, tripInitialFormData } from "@/constants/storeInitailObjects";
import { create } from "zustand";

  interface FieldType<T> {
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
  price: FieldType<string>;
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
  isAirportPickup: FieldType<boolean>;
  isFlightTrack: FieldType<boolean>;
  isMeetGreet: FieldType<boolean>;
  isReturn: FieldType<boolean>;
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
    if (key === "stops" && typeof index === "number") {
      set((state) => {
        const stops = [...state.formData.stops];
        stops[index] = { ...stops[index], value: value as string, coardinates, error:'' };
        return { formData: { ...state.formData, stops } };
      });
      return;
    }
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: { ...state.formData[key as keyof FormDataType], value, coardinates, error:''  },
      },
    }));
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
      const hasErr = item.step === _step && item.required && !item.value;
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
      console.log("not validate")
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
      const original = Object.entries(formData).reduce<Record<string, string | boolean | number | string[] >>((acc, [key, item]) => {
        if (key === "stops") {
          acc.stops = formData.stops.map((s) => (s.value));
        } else {
          acc[key] = (item as FieldType<string | boolean | number>).value;
        }
        return acc;
      }, {});

      try {
        const newObject = {
  id: original.paymentId || null,
  name: original.name,
  email: original.email,
  phone_number: original.phone,

  from_location: original.fromLocation,
  to_location: original.toLocation,
  pickup_date: original.date,
  pickup_time: original.time,
  return_date: original.returnDate,
  return_time: original.returnTime,

  Passengers: original.passengers,
  luggage: original.bags,

  // seats
  rear_seats: 0,
  booster_seats: 0,
  carSeats: 0,
  infantSeat: 0,
  return_rear_seats: 0,
  return_booster_seats: 0,
  returnCarSeats: 0,
  returnInfantSeat: 0,

  // flight info
  flight_number: original.flightNumber,
  airline_code: original.flightName || "",
  return_flight_number: "",
  return_airline_code: "",

  // trip info
  returnTrip: original.isReturn,
  tripType: original.isReturn ? "return" : "oneway",

  // car and pricing
  car_type: original.car,
  base_price: original.price,
  distance: original.distance,
  price: original.price,
  tax: 0,
  gratuity: 0,
  airport_fee: original.isAirportPickup ? 10 : 0, // example fee
  hours: original.duration || "",

  // stops
  stop1: (original.stops as string[]) [0] || "",
  stop2: (original.stops as string[])[1] || "",
  stop3: (original.stops as string[])[2] || "",
  stop4: (original.stops as string[])[3] || "",
  stopsCount: (original.stops as string[]).length,

  // meet greet
  meetGreet: original.isMeetGreet,
  returnMeetGreet: false,

  // return trip stops
  return_pickup: "",
  return_stop1: "",
  return_stop2: "",
  return_stop3: "",
  return_stop4: "",
  returnStopsCount: 0,
};
        console.log('orderData ',newObject)
        const res = await fetch("https://devsquare-apis.vercel.app/api/dslLimoService/booking", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newObject),
                    });
                    const response = await res.json()
        if (response.status !== 201) {
          set({ formError: response.error, formLoading: false });
          return false;
        }
        set({ formError: "", formLoading: false, orderId:response?.order?.id ?? ''  });
      } catch (error) {
        set({ formError: error instanceof Error ? error.message : "Failed to place order", formLoading: false });
        return false;
      }
    }
    if(_step===4 && isNext){
      set((state) => ({ ...state, formError: "", formLoading: false, step: 1, isOrderDone:true }));
      return true;
    }
    console.log("working fine : ",_step)
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
  
  resetForm: () => set({ formData: tripInitialFormData, step: 1, category: "trip", formError: "", formLoading: false, isMobileDropdownOpen:false, isOrderDone:false, orderId:'' }),
  }));

export default useFormStore;