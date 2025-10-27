import { FormDataType } from "@/stores/FormStore"


const commonFormDataFields = {
  fromLocation: {
    value: "",
    coardinates: "",
    error: "",
    required: true,
    coardinatesRequired: true,
    step: 1,
  },
  toLocation: {
    value: "",
    coardinates: "",
    error: "",
    required: true,
    step: 1,
    coardinatesRequired: true,
  },
  stops: [],
  duration: {
    value: "",
    error: "",
    required: false,
    step: 1,
    coardinates: "",
    coardinatesRequired: false,
  },
  distance: {
    value: 0,
    error: "",
    required: true,
    step: 2,
    coardinates: "",
    coardinatesRequired: false,
  },
  car: { value: "", error: "", required: true, step: 2, coardinates: "", coardinatesRequired: false },
  price: { value: "20", error: "", required: true, step: 2, coardinates: "", coardinatesRequired: false },
  name: { value: "", error: "", required: true, step: 3, coardinates: "", coardinatesRequired: false },
  phone: { value: "", error: "", required: true, step: 3, coardinates: "", coardinatesRequired: false },
  email: { value: "", error: "", required: true, step: 3, coardinates: "", coardinatesRequired: false },
  date: { value: "", error: "", required: true, step: 3, coardinates: "", coardinatesRequired: false },
  time: { value: "", error: "", required: true, step: 3, coardinates: "", coardinatesRequired: false },
  returnDate: { value: "", error: "", required: false, step: 3, coardinates: "", coardinatesRequired: false },
  returnTime: { value: "", error: "", required: false, step: 3, coardinates: "", coardinatesRequired: false },
  passengers: { value: "", error: "", required: true, step: 3, coardinates: "", coardinatesRequired: false },
  bags: { value: "", error: "", required: true, step: 3, coardinates: "", coardinatesRequired: false },
  flightName: { value: "", error: "", required: false, step: 3, coardinates: "", coardinatesRequired: false },
  flightNumber: { value: "", error: "", required: false, step: 3, coardinates: "", coardinatesRequired: false },
  isAirportPickup: { value: false, error: "", required: false, step: 3, coardinates: "", coardinatesRequired: false },
  isFlightTrack: { value: false, error: "", required: false, step: 3, coardinates: "", coardinatesRequired: false },
  isMeetGreet: { value: false, error: "", required: false, step: 3, coardinates: "", coardinatesRequired: false },
  isReturn: { value: false, error: "", required: false, step: 3, coardinates: "", coardinatesRequired: false },
  paymentId: { value: "", error: "", required: true, step: 4, coardinates: "", coardinatesRequired: false },
}

export const tripInitialFormData: FormDataType = {
  ...commonFormDataFields,
  duration: { ...commonFormDataFields.duration, required: false },
  distance: { ...commonFormDataFields.distance, required: true },
  toLocation: { ...commonFormDataFields.toLocation, required: true, coardinatesRequired: true },
}

export const hourlyInitialFormData: FormDataType = {
  ...commonFormDataFields,
  toLocation: { ...commonFormDataFields.toLocation, required: false, coardinatesRequired: false },
  duration: { ...commonFormDataFields.duration, required: true },
  distance: { ...commonFormDataFields.distance, required: false },
}
