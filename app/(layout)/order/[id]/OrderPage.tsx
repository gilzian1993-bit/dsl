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

interface GetOrderByIdResult {
  status: number
  order: OrderProps | null
  error: string | null
}

function OrderPage({ id }: { id: string }) {
  const [order, setOrder] = useState<OrderProps | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
  try {
    setLoading(true)
    setError(null)
    
    if (!id || id === "undefined" || id === "null") {
      setError("Invalid order ID")
      setLoading(false)
      return
    }

    console.log("Fetching order for ID:", id)
    const result = await getOrderById(id)
    
    console.log("API Result:", result)

    if (result.status === 200 && result.order) {
      const orderData = result.order
      const formattedOrder: OrderProps = {
        ...orderData,
        pickup_date: orderData.pickup_date ? new Date(orderData.pickup_date).toISOString() : null,
        return_date: orderData.return_date ? new Date(orderData.return_date).toISOString() : null,
        created_at: orderData.created_at ? new Date(orderData.created_at).toISOString() : new Date().toISOString(),
      }
      setOrder(formattedOrder)
    } else {
      setError(result.error || "Failed to fetch order details")
    }
  } catch (err: unknown) {
    console.error("Error in OrderPage:", err)
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
    setError(errorMessage)
  } finally {
    setLoading(false)
  }
}
    
    if (id) {
      fetchOrder()
    } else {
      setError("No order ID provided")
      setLoading(false)
    }
  }, [id])

  const toMiles = (km?: string | null): string => {
    if (!km) return "0"
    const num = parseFloat(km)
    return isNaN(num) ? "0" : (num * 0.621371).toFixed(2)
  }

  const formatPrice = (price: string | null | undefined): string => {
    if (!price) return "$0.00"
    const num = parseFloat(price)
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`
  }

  const handleCopy = (text: string, field: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }).catch((copyError: Error) => {
      console.error("Failed to copy text:", copyError)
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Order Details</h2>
          <p className="text-gray-600">Please wait while we fetch your order information...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Order</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No order found
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600">The requested order could not be found.</p>
        </div>
      </div>
    )
  }

  const stops = order.stops || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="h-14 sm:h-20 w-full bg-black"></div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Order Header */}
        <header className="bg-[#181818] text-white flex flex-col sm:flex-row justify-between items-center px-6 sm:px-8 py-6 rounded-2xl mb-8">
          <div className="mb-4 sm:mb-0">
            <Image
              src="/Logo.png"
              alt="DSL Logo"
              width={140}
              height={70}
              className="w-24 sm:w-32 object-contain"
              priority
            />
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-300 mb-1">Order ID</p>
            <div className="flex items-center gap-2 justify-center sm:justify-end">
              <p className="text-white font-medium text-sm sm:text-base">#{order.id}</p>
              <button
                onClick={() => handleCopy(order.id.toString(), 'orderId')}
                className="flex items-center gap-1 text-gray-400 hover:text-gray-200 transition-colors"
                title="Copy Order ID"
              >
                <TbCopy className="text-lg" />
                {copiedField === 'orderId' && (
                  <span className="text-xs text-green-400">Copied!</span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard 
              label="Total Amount" 
              value={formatPrice(order.total_price)} 
              color="text-green-600" 
            />
            {order.category === "hourly" ? (
              <SummaryCard 
                label="Duration" 
                value={`${order.hours || '0'} hours`} 
              />
            ) : (
              <SummaryCard 
                label="Distance" 
                value={`${toMiles(order.distance)} miles`} 
              />
            )}
            <SummaryCard 
              label="Trip Type" 
              value={order.category?.toUpperCase() || order.trip_type?.toUpperCase() || "N/A"} 
            />
          </div>

          {/* Route Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <IoCarSportSharp className="text-blue-600 text-xl" /> 
              Route Information
            </h2>

            <div className="relative pl-6">
              {/* Pickup Location */}
              <TimelineItem
                color="#10b981"
                label="Pick-Up Location"
                value={order.from_location}
                date={order.pickup_date}
                time={order.pickup_time}
              />

              {/* Stops */}
              {stops.map((stop, index) => (
                <TimelineItem
                  key={index}
                  color="#3b82f6"
                  label={`Stop ${index + 1}`}
                  value={stop}
                />
              ))}

              {/* Destination or Duration */}
              {order.category === "hourly" ? (
                <TimelineItem
                  color="#ef4444"
                  label="Duration"
                  value={`${order.hours || '0'} hours`}
                />
              ) : (
                <TimelineItem
                  color="#ef4444"
                  label="Drop-Off Location"
                  value={order.to_location || "N/A"}
                />
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trip Details */}
            <InfoCard title="Trip Details">
              <InfoField label="Car Type" value={order.car_type || "N/A"} />
              <InfoField label="Trip Type" value={order.trip_type || "N/A"} />
              <InfoField label="Return Date" value={formatDate(order.return_date)} />
              <InfoField label="Return Time" value={formatTime(order.return_time)} />
              <InfoField label="Flight Tracking" value={order.is_flight_track ? "Yes" : "No"} />
              <InfoField label="Meet & Greet" value={order.meet_greet ? "Yes" : "No"} />
              {order.return_trip && (
                <InfoField label="Return Meet & Greet" value={order.return_meet_greet ? "Yes" : "No"} />
              )}
              <InfoField label="Airport Pickup" value={order.is_airport_pickup ? "Yes" : "No"} />
            </InfoCard>

            {/* Passenger & Vehicle Info */}
            <InfoCard title="Passenger & Vehicle">
              <InfoField label="Passengers" value={order.passengers?.toString() || "N/A"} />
              <InfoField label="Luggage" value={order.luggage?.toString() || "N/A"} />
              <InfoField label="Rear Seats" value={order.rear_seats?.toString() || "0"} />
              <InfoField label="Booster Seats" value={order.booster_seats?.toString() || "0"} />
              <InfoField label="Infant Seats" value={order.infant_seat?.toString() || "0"} />
              {order.return_trip && (
                <>
                  <InfoField label="Return Rear Seats" value={order.return_rear_seats?.toString() || "0"} />
                  <InfoField label="Return Booster Seats" value={order.return_booster_seats?.toString() || "0"} />
                  <InfoField label="Return Infant Seats" value={order.return_infant_seat?.toString() || "0"} />
                </>
              )}
            </InfoCard>

            {/* Customer Information */}
            <InfoCard title="Customer Information">
              <InfoField 
                label="Name" 
                value={order.name} 
                icon={<BiUserCircle className="text-blue-600" />} 
                onCopy={() => handleCopy(order.name, 'name')}
                copied={copiedField === 'name'}
              />
              <InfoField 
                label="Email" 
                value={order.email} 
                icon={<MdOutlineEmail className="text-green-600" />} 
                onCopy={() => handleCopy(order.email, 'email')}
                copied={copiedField === 'email'}
              />
              <InfoField 
                label="Phone" 
                value={order.phone_number} 
                icon={<MdOutlinePhone className="text-purple-600" />} 
                onCopy={() => handleCopy(order.phone_number, 'phone')}
                copied={copiedField === 'phone'}
              />
              <InfoField 
                label="Flight Number" 
                value={order.flight_number || "N/A"} 
                icon={<MdOutlineFlight className="text-orange-600" />} 
              />
              <InfoField 
                label="Airline Code" 
                value={order.airline_code || "N/A"} 
                icon={<MdAirlines className="text-red-600" />} 
              />
              <InfoField 
                label="Payment ID" 
                value={order.payment_id || "N/A"} 
                icon={<MdOutlinePayment className="text-indigo-600" />} 
                onCopy={() => handleCopy(order.payment_id || '', 'paymentId')}
                copied={copiedField === 'paymentId'}
              />
              <InfoField 
                label="Order Date" 
                value={formatDate(order.created_at)} 
                icon={<Timer className="text-gray-600" size={18} />} 
              />
            </InfoCard>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h2>

            <div className="space-y-3 text-sm">
              {/* Base Price */}
              <PriceItem label="Base Price" value={formatPrice(String(Number(Number(order?.base_price) ?? 0 ) + (Number(order.stops?.length ?? 0)*20)))} />

              {/* Discount */}
              {order.discount && parseFloat(order.discount) > 0 && (
                <PriceItem label="Discount" value={`- ${formatPrice(order.discount)}`} isDiscount />
              )}

              {/* Additional Services */}
              {order.gratuity && parseFloat(order.gratuity) > 0 && (
                <PriceItem label="Gratuity" value={formatPrice(order.gratuity)} />
              )}

              {order.is_meet_greet_price && parseFloat(order.is_meet_greet_price) > 0 && (
                <PriceItem label="Meet & Greet" value={formatPrice(order.is_meet_greet_price)} />
              )}

              {order.rear_seat_price && parseFloat(order.rear_seat_price) > 0 && (
                <PriceItem label="Rear Seats" value={formatPrice(order.rear_seat_price)} />
              )}

              {order.infant_seat_price && parseFloat(order.infant_seat_price) > 0 && (
                <PriceItem label="Infant Seats" value={formatPrice(order.infant_seat_price)} />
              )}

              {order.booster_seat_price && parseFloat(order.booster_seat_price) > 0 && (
                <PriceItem label="Booster Seats" value={formatPrice(order.booster_seat_price)} />
              )}

              {/* Return Trip Services */}
              {order.return_price && parseFloat(order.return_price) > 0 && (
                <PriceItem label="Return Transfer" value={formatPrice(order.return_price)} />
              )}

              {order.is_return_meet_greet_price && parseFloat(order.is_return_meet_greet_price) > 0 && (
                <PriceItem label="Return Meet & Greet" value={formatPrice(order.is_return_meet_greet_price)} />
              )}

              {order.return_rear_seat_price && parseFloat(order.return_rear_seat_price) > 0 && (
                <PriceItem label="Return Rear Seats" value={formatPrice(order.return_rear_seat_price)} />
              )}

              {order.return_infant_seat_price && parseFloat(order.return_infant_seat_price) > 0 && (
                <PriceItem label="Return Infant Seats" value={formatPrice(order.return_infant_seat_price)} />
              )}

              {order.return_booster_seat_price && parseFloat(order.return_booster_seat_price) > 0 && (
                <PriceItem label="Return Booster Seats" value={formatPrice(order.return_booster_seat_price)} />
              )}

              {/* Stops Price */}
              {/* {(order.stops?.length ?? 0) > 0 && (
                <PriceItem 
                  label={`Stops (${order.stops?.length})`} 
                  value={formatPrice(((order.stops?.length ?? 0) * 20).toString())} 
                />
              )} */}

              {/* Tax */}
              {order.tax && parseFloat(order.tax) > 0 && (
                <PriceItem label="Tax" value={formatPrice(order.tax)} />
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t-2 border-dashed border-gray-300 mt-6 pt-4 text-lg font-bold text-gray-900">
              <span>Total Amount</span>
              <span className="text-green-600">{formatPrice(order.total_price)}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ---------- Helper Components ---------- */

interface SummaryCardProps {
  label: string
  value: string
  color?: string
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
    <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
    <p className={`text-xl font-bold ${color || "text-gray-800"}`}>{value}</p>
  </div>
)

interface TimelineItemProps {
  color: string
  label: string
  value?: string
  date?: string | null
  time?: string | null
}

const TimelineItem: React.FC<TimelineItemProps> = ({ color, label, value, date, time }) => (
  <div className="relative pb-6 last:pb-0">
    <div 
      className="absolute -left-0.5 w-4 h-4 top-1 rounded-full border-2 border-white shadow-sm"
      style={{ backgroundColor: color }}
    ></div>
    <div className="ml-6">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      {date && (
        <p className="text-xs text-gray-500 mt-1">
          {formatDate(date)} • {formatTime(time)}
        </p>
      )}
      <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded border">{value}</p>
    </div>
  </div>
)

interface InfoCardProps {
  title: string
  children: React.ReactNode
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
)

interface InfoFieldProps {
  label: string
  value: string
  icon?: React.ReactNode
  onCopy?: () => void
  copied?: boolean
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon, onCopy, copied = false }) => (
  <div className="flex items-start justify-between group">
    <div className="flex items-start gap-3 flex-1">
      {icon && <span className="text-lg mt-0.5 flex-shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-medium">{label}</p>
        <p className="text-gray-800 font-medium text-sm break-words">{value}</p>
      </div>
    </div>
    {onCopy && (
      <button
        onClick={onCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
        title="Copy to clipboard"
      >
        {copied ? (
          <span className="text-green-500 text-xs">Copied!</span>
        ) : (
          <TbCopy size={16} />
        )}
      </button>
    )}
  </div>
)

interface PriceItemProps {
  label: string
  value: string
  isDiscount?: boolean
}

const PriceItem: React.FC<PriceItemProps> = ({ label, value, isDiscount = false }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-gray-600">{label}</span>
    <span className={`font-medium ${isDiscount ? 'text-red-600' : 'text-gray-800'}`}>
      {value}
    </span>
  </div>
)

/* ---------- Utility Functions ---------- */

function formatDate(date?: string | null): string {
  if (!date) return "N/A"
  try {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return "N/A"
  }
}

function formatTime(time?: string | null): string {
  if (!time) return "N/A"
  try {
    const [hours24, minutes] = time.split(":")
    const hours24Int = parseInt(hours24)
    
    if (isNaN(hours24Int) || isNaN(parseInt(minutes))) {
      return time // Return original if parsing fails
    }
    
    let hours12: number
    let period: string
    
    if (hours24Int === 0) {
      hours12 = 12
      period = "AM"
    } else if (hours24Int === 12) {
      hours12 = 12
      period = "PM"
    } else if (hours24Int > 12) {
      hours12 = hours24Int - 12
      period = "PM"
    } else {
      hours12 = hours24Int
      period = "AM"
    }
    
    return `${hours12}:${minutes.padStart(2, "0")} ${period}`
  } catch {
    return time || "N/A"
  }
}

export default OrderPage