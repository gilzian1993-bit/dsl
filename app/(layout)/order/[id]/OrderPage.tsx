"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getOrderById } from "@/actions/get-order-by-id"
import { TbCopy } from "react-icons/tb"
import { MdOutlineFlight, MdOutlineEmail, MdOutlinePhone, MdOutlinePayment, MdAirlines } from "react-icons/md"
import { IoCarSportSharp } from "react-icons/io5"
import { BiUserCircle } from "react-icons/bi"
import Image from "next/image"
import { Timer } from "lucide-react"

export interface OrderProps {
  id: number
  payment_id: string | null
  name: string
  email: string
  phone_number: string
  from_location: string
  to_location: string
  stops: string[] | null
  pickup_date: string | null
  pickup_time: string | null
  return_date: string | null
  return_time: string | null
  passengers: number | null
  luggage: number | null
  flight_number: string | null
  airline_code: string | null
  car_type: string | null
  return_trip: boolean | null
  trip_type: string | null
  hours: string | null
  distance: string | null
  rear_seats: number | null
  booster_seats: number | null
  infant_seat: number | null
  return_rear_seats: number | null
  return_booster_seats: number | null
  return_infant_seat: number | null
  meet_greet: boolean | null
  return_meet_greet: boolean | null
  base_price: string | null
  gratuity: string | null
  tax: string | null
  discount: string | null
  is_meet_greet_price: string | null
  rear_seat_price: string | null
  infant_seat_price: string | null
  booster_seat_price: string | null
  return_price: string | null
  is_return_meet_greet_price: string | null
  return_rear_seat_price: string | null
  return_infant_seat_price: string | null
  return_booster_seat_price: string | null
  total_price: string | null
  is_airport_pickup: boolean | null
  is_flight_track: boolean | null
  category: string | null
  car_image: string | null
  created_at: string
}

function OrderPage({ id }: { id: string }) {
  const [order, setOrder] = useState<OrderProps | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await getOrderById(id)
        if (result.status === 200 && result.order) {
          const orderData = result.order
          const formattedOrder = {
            ...orderData,
            pickup_date: orderData.pickup_date ? new Date(orderData.pickup_date).toISOString() : null,
            return_date: orderData.return_date ? new Date(orderData.return_date).toISOString() : null,
            created_at: orderData.created_at ? orderData.created_at.toISOString() : "",
          }
          setOrder(formattedOrder)
        } else {
          setError(result.error)
        }
      } catch (err) {
        console.log("error : ", err)
        setError("Failed to fetch the order.")
      }
    }
    if (id) fetchOrder()
  }, [id])


  const toMiles = (km?: string | null) => {
    const num = Number.parseFloat(km || "0")
    return isNaN(num) ? "0" : (num * 0.621371).toFixed(2)
  }

  const formatPrice = (price: string | null | undefined) => {
    const num = Number.parseFloat(price || "0")
    return isNaN(num) ? "£0.00" : `£${num.toFixed(2)}`
  }

  if (error) return <div className="text-center py-40 text-2xl text-red-500">{error}</div>

  if (!order) return <div className="text-center py-40 text-2xl animate-pulse">Loading...</div>

  const stops = order.stops || []

  return (
    <div className="min-h-screen bg-gray-50 text-wrap break-all">
      <div className="h-14 sm:h-20 w-full bg-black mb-10"></div>

      <div className="px-3">
        {/* Header */}
        <header className="bg-[#181818] text-white flex justify-between items-center px-6 sm:px-10 py-5 max-w-5xl mx-auto rounded-2xl">
          <Image
            src="/Logo.png"
            alt="DSL Logo"
            width={120}
            height={60}
            className="max-w-16 sm:max-w-32 object-contain"
            priority
          />
          <div className="text-right">
            <p className="text-sm text-gray-300">Order ID</p>
            <div className="flex items-center gap-1 justify-end">
              <p className="text-white font-medium text-[10px] sm:text-sm">{order.id}</p>
              <TbCopy
                onClick={() => navigator.clipboard.writeText(order.id.toString())}
                className="cursor-pointer text-gray-400 hover:text-gray-200"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto py-10">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <SummaryCard label="Total Amount" value={formatPrice(order.total_price)} color="text-red-600" />
            {order.category === "hourly" ? (
              <SummaryCard label="Duration" value={`${order.hours} hours`} />
            ) : (
              <SummaryCard label="Distance" value={`${toMiles(order.distance?.toString())} miles`} />
            )}
            <SummaryCard label="Trip Type" value={order.category?.toLowerCase() ?? order.trip_type?.toLocaleUpperCase() ?? "N/A"} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <IoCarSportSharp className="text-brandColor text-xl" /> Route Information
            </h2>

            <div className="relative pl-6">
              <TimelineItem
                color="green"
                label="Pick-Up"
                value={order.from_location}
                date={order.pickup_date}
                time={order.pickup_time}
              />

              {stops.map((stop, i) => (
                <TimelineItem key={i} color="blue" label={`Stop ${i + 1}`} value={stop} />
              ))}

              {order.category === "hourly" ? (
                <TimelineItem color="red" label="Duration" value={order.hours?.toString() || "N/A"} />
              ) : (
                <TimelineItem color="red" label="Drop-Off" value={order.to_location || "N/A"} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Trip Details */}
            <InfoCard title="Trip Details">
              <InfoField label="Car Type" value={order.car_type || "N/A"} />
              <InfoField label="Trip Type" value={order.trip_type || "N/A"} />
              <InfoField label="Return Date" value={formatDate(order.return_date)} />
              <InfoField label="Return Time" value={order.return_time || "N/A"} />
              <InfoField label="Flight Track" value={order.is_flight_track ? "Yes" : "No"} />
              <InfoField label="Meet & Greet" value={order.meet_greet ? "Yes" : "No"} />
              {order.return_trip && <InfoField label="Return Meeting" value={order.return_meet_greet ? "Yes" : "No"} />}
              <InfoField label="Airport Pickup" value={order.is_airport_pickup ? "Yes" : "No"} />
            </InfoCard>

            {/* Passenger & Vehicle Info */}
            <InfoCard title="Passenger & Vehicle">
              <InfoField label="Passengers" value={order.passengers?.toString() || "N/A"} />
              <InfoField label="Luggage" value={order.luggage?.toString() || "N/A"} />
              <InfoField label="Rear Seats" value={order.rear_seats?.toString() || "0"} />
              <InfoField label="Booster Seats" value={order.booster_seats?.toString() || "0"} />
              <InfoField label="Infant Seat" value={order.infant_seat?.toString() || "0"} />
              {order.return_trip && (
                <>
                  <InfoField label="Return Rear Seats" value={order.return_rear_seats?.toString() || "0"} />
                  <InfoField label="Return Booster Seats" value={order.return_booster_seats?.toString() || "0"} />
                  <InfoField label="Return Infant Seat" value={order.return_infant_seat?.toString() || "0"} />
                </>
              )}
            </InfoCard>

            {/* Customer Info */}
            <InfoCard title="Customer Information">
              <InfoField label="Name" value={order.name} icon={<BiUserCircle />} />
              <InfoField label="Email" value={order.email} icon={<MdOutlineEmail />} />
              <InfoField label="Phone" value={order.phone_number} icon={<MdOutlinePhone />} />
              <InfoField label="Flight Number" value={order.flight_number || "N/A"} icon={<MdOutlineFlight />} />
              <InfoField label="Airline Code" value={order.airline_code || "N/A"} icon={<MdAirlines />} />
              <InfoField label="Payment ID" value={order.payment_id || "N/A"} icon={<MdOutlinePayment />} />
              <InfoField label="Ordered At" value={formatDate(order.created_at.toString())} icon={<Timer />} />
            </InfoCard>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h2>

            <div className="space-y-2 text-sm text-gray-600">
              {/* Base Price */}
              <div className="flex justify-between">
                <span>Base Price</span>
                <span>{formatPrice(order.base_price)}</span>
              </div>

              {/* Discount */}
              {order.discount && Number.parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span>- {formatPrice(order.discount)}</span>
                </div>
              )}

              {/* Gratuity */}
              {order.gratuity && Number.parseFloat(order.gratuity) > 0 && (
                <div className="flex justify-between">
                  <span>Gratuity</span>
                  <span>{formatPrice(order.gratuity)}</span>
                </div>
              )}

              

              {/* Meet & Greet */}
              {order.is_meet_greet_price && Number.parseFloat(order.is_meet_greet_price) > 0 && (
                <div className="flex justify-between">
                  <span>Meet & Greet</span>
                  <span>{formatPrice(order.is_meet_greet_price)}</span>
                </div>
              )}

              {/* Rear Seat */}
              {order.rear_seat_price && Number.parseFloat(order.rear_seat_price) > 0 && (
                <div className="flex justify-between">
                  <span>Rear Seat</span>
                  <span>{formatPrice(order.rear_seat_price)}</span>
                </div>
              )}

              {/* Infant Seat */}
              {order.infant_seat_price && Number.parseFloat(order.infant_seat_price) > 0 && (
                <div className="flex justify-between">
                  <span>Infant Seat</span>
                  <span>{formatPrice(order.infant_seat_price)}</span>
                </div>
              )}

              {/* Booster Seat */}
              {order.booster_seat_price && Number.parseFloat(order.booster_seat_price) > 0 && (
                <div className="flex justify-between">
                  <span>Booster Seat</span>
                  <span>{formatPrice(order.booster_seat_price)}</span>
                </div>
              )}

              {/* Return Transfer */}
              {order.return_price && Number.parseFloat(order.return_price) > 0 && (
                <div className="flex justify-between">
                  <span>Return Transfer</span>
                  <span>{formatPrice(order.return_price)}</span>
                </div>
              )}

              {/* Return Meet & Greet */}
              {order.is_return_meet_greet_price && Number.parseFloat(order.is_return_meet_greet_price) > 0 && (
                <div className="flex justify-between">
                  <span>Return Meet & Greet</span>
                  <span>{formatPrice(order.is_return_meet_greet_price)}</span>
                </div>
              )}

              {/* Return Rear Seat */}
              {order.return_rear_seat_price && Number.parseFloat(order.return_rear_seat_price) > 0 && (
                <div className="flex justify-between">
                  <span>Return Rear Seat</span>
                  <span>{formatPrice(order.return_rear_seat_price)}</span>
                </div>
              )}

              {/* Return Infant Seat */}
              {order.return_infant_seat_price && Number.parseFloat(order.return_infant_seat_price) > 0 && (
                <div className="flex justify-between">
                  <span>Return Infant Seat</span>
                  <span>{formatPrice(order.return_infant_seat_price)}</span>
                </div>
              )}

              {/* Return Booster Seat */}
              {order.return_booster_seat_price && Number.parseFloat(order.return_booster_seat_price) > 0 && (
                <div className="flex justify-between">
                  <span>Return Booster Seat</span>
                  <span>{formatPrice(order.return_booster_seat_price)}</span>
                </div>
              )}

              {/* Stops Pirce */}
              {(order.stops?.length ?? 0) > 0  && (
                <div className="flex justify-between">
                  <span>Stops Price</span>
                  <span>{formatPrice(((order.stops?.length ?? 0) * 20).toString())}</span>
                </div>
              )}

              {/* Tax */}
              {order.tax && Number.parseFloat(order.tax) > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
            </div>

            {/* Total with dashed separator */}
            <div className="flex justify-between items-center border-t-2 border-dashed border-gray-300 mt-4 pt-4 text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.total_price)}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ---------- Helper Components ---------- */

const SummaryCard = ({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) => (
  <div className="bg-[#fff9ef] border border-yellow-200 rounded-xl p-4 flex flex-col justify-center text-center">
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <p className={`text-xl font-bold ${color || "text-gray-800"} mt-1`}>{value}</p>
  </div>
)

const TimelineItem = ({
  color,
  label,
  value,
  date,
  time,
}: {
  color: string
  label: string
  value?: string
  date?: string | null
  time?: string | null
}) => (
  <div className="relative pb-6">
    <div className={`absolute -left-0.5 w-4 h-4 top-1 rounded-full`} style={{ backgroundColor: color }}></div>

    <div className="ml-6">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      {date && (
        <p className="text-xs text-gray-500">
          {formatDate(date)} • {time || "N/A"}
        </p>
      )}
      <p className="text-sm text-gray-700 mt-1">{value}</p>
    </div>
  </div>
)

const InfoCard = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6">
    <h3 className="text-md font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
)

const InfoField = ({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) => (
  <div className="flex items-start gap-2">
    {icon && <span className="text-gray-500 text-lg mt-0.5">{icon}</span>}
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-gray-800 font-medium text-sm">{value}</p>
    </div>
  </div>
)

/* ---------- Utils ---------- */

function formatDate(date?: string | null) {
  if (!date) return "N/A"
  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return "N/A"
  }
}

export default OrderPage
