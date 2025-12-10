"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById } from "@/actions/get-order-by-id";
import { Button } from "@/app/components/ui/button";
import { TbCopy } from "react-icons/tb";
import {
  MdOutlineFlight,
  MdOutlineEmail,
  MdOutlinePhone,
  MdOutlinePayment,
  MdAirlines,
} from "react-icons/md";
import { IoCarSportSharp } from "react-icons/io5";
import { BiUserCircle } from "react-icons/bi";
import { Timer, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export interface OrderProps {
  id: number;
  payment_id: string | null;
  name: string;
  email: string;
  phone_number: string;
  payment_status: string | null;
  from_location: string;
  to_location: string;
  stops: string[] | null;
  pickup_date: string | null;
  pickup_time: string | null;
  return_date: string | null;
  return_time: string | null;
  passengers: number | null;
  luggage: number | null;
  flight_number: string | null;
  airline_code: string | null;
  car_type: string | null;
  return_trip: boolean | null;
  trip_type: string | null;
  hours: string | null;
  distance: string | null;
  rear_seats: number | null;
  booster_seats: number | null;
  infant_seat: number | null;
  return_rear_seats: number | null;
  return_booster_seats: number | null;
  return_infant_seat: number | null;
  meet_greet: boolean | null;
  return_meet_greet: boolean | null;
  base_price: string | null;
  gratuity: string | null;
  tax: string | null;
  discount: string | null;
  is_meet_greet_price: string | null;
  rear_seat_price: string | null;
  infant_seat_price: string | null;
  booster_seat_price: string | null;
  return_price: string | null;
  is_return_meet_greet_price: string | null;
  return_rear_seat_price: string | null;
  return_infant_seat_price: string | null;
  return_booster_seat_price: string | null;
  total_price: string | null;
  is_airport_pickup: boolean | null;
  is_flight_track: boolean | null;
  category: string | null;
  car_image: string | null;
  created_at: string;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        if (!id || id === "undefined" || id === "null") {
          setError("Invalid booking ID");
          setLoading(false);
          return;
        }

        const result = await getOrderById(id);

        if (result.status === 200 && result.order) {
          const orderData = result.order;
          const formattedOrder: OrderProps = {
            ...orderData,
            pickup_date: orderData.pickup_date
              ? new Date(orderData.pickup_date).toISOString()
              : null,
            return_date: orderData.return_date
              ? new Date(orderData.return_date).toISOString()
              : null,
            created_at: orderData.created_at
              ? new Date(orderData.created_at).toISOString()
              : new Date().toISOString(),
          };
          setOrder(formattedOrder);
        } else {
          setError(result.error || "Failed to fetch booking details");
        }
      } catch (err: unknown) {
        console.error("Error in BookingDetailPage:", err);
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    } else {
      setError("No booking ID provided");
      setLoading(false);
    }
  }, [id]);

  const toMiles = (km?: string | null): string => {
    if (!km) return "0";
    const num = parseFloat(km);
    return isNaN(num) ? "0" : (num * 0.621371).toFixed(2);
  };

  const formatPrice = (price: string | null | undefined): string => {
    if (!price) return "$0.00";
    const num = parseFloat(price);
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
  };

  const handleCopy = (text: string, field: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Booking Details
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the booking information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to Load Booking
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600">The requested booking could not be found.</p>
        </div>
      </div>
    );
  }

  const stops = order.stops || [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bookings
      </Button>

      {/* Booking Header */}
      <header className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Booking #{order.id}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Created on {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                order.payment_status === "paid"
                  ? "bg-green-100 text-green-800"
                  : order.payment_status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.payment_status || "pending"}
            </span>
          </div>
        </div>
      </header>

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
            value={`${order.hours || "0"} hours`}
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <IoCarSportSharp className="text-primary text-xl" />
          Route Information
        </h2>

        <div className="relative pl-6">
          <TimelineItem
            color="#10b981"
            label="Pick-Up Location"
            value={order.from_location}
            date={order.pickup_date}
            time={order.pickup_time}
          />

          {stops.map((stop, index) => (
            <TimelineItem
              key={index}
              color="#3b82f6"
              label={`Stop ${index + 1}`}
              value={stop}
            />
          ))}

          {order.category === "hourly" ? (
            <TimelineItem
              color="#ef4444"
              label="Duration"
              value={`${order.hours || "0"} hours`}
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
        <InfoCard title="Trip Details">
          <InfoField label="Car Type" value={order.car_type || "N/A"} />
          <InfoField label="Trip Type" value={order.trip_type || "N/A"} />
          <InfoField label="Return Date" value={formatDate(order.return_date)} />
          <InfoField label="Return Time" value={formatTime(order.return_time)} />
          <InfoField
            label="Flight Tracking"
            value={order.is_flight_track ? "Yes" : "No"}
          />
          <InfoField label="Meet & Greet" value={order.meet_greet ? "Yes" : "No"} />
          {order.return_trip && (
            <InfoField
              label="Return Meet & Greet"
              value={order.return_meet_greet ? "Yes" : "No"}
            />
          )}
          <InfoField
            label="Airport Pickup"
            value={order.is_airport_pickup ? "Yes" : "No"}
          />
        </InfoCard>

        <InfoCard title="Passenger & Vehicle">
          <InfoField
            label="Passengers"
            value={order.passengers?.toString() || "N/A"}
          />
          <InfoField label="Luggage" value={order.luggage?.toString() || "N/A"} />
          <InfoField label="Rear Seats" value={order.rear_seats?.toString() || "0"} />
          <InfoField
            label="Booster Seats"
            value={order.booster_seats?.toString() || "0"}
          />
          <InfoField
            label="Infant Seats"
            value={order.infant_seat?.toString() || "0"}
          />
          {order.return_trip && (
            <>
              <InfoField
                label="Return Rear Seats"
                value={order.return_rear_seats?.toString() || "0"}
              />
              <InfoField
                label="Return Booster Seats"
                value={order.return_booster_seats?.toString() || "0"}
              />
              <InfoField
                label="Return Infant Seats"
                value={order.return_infant_seat?.toString() || "0"}
              />
            </>
          )}
        </InfoCard>

        <InfoCard title="Customer Information">
          <InfoField
            label="Name"
            value={order.name}
            icon={<BiUserCircle className="text-primary" />}
            onCopy={() => handleCopy(order.name, "name")}
            copied={copiedField === "name"}
          />
          <InfoField
            label="Email"
            value={order.email}
            icon={<MdOutlineEmail className="text-green-600" />}
            onCopy={() => handleCopy(order.email, "email")}
            copied={copiedField === "email"}
          />
          <InfoField
            label="Phone"
            value={order.phone_number}
            icon={<MdOutlinePhone className="text-purple-600" />}
            onCopy={() => handleCopy(order.phone_number, "phone")}
            copied={copiedField === "phone"}
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
            onCopy={() => handleCopy(order.payment_id || "", "paymentId")}
            copied={copiedField === "paymentId"}
          />
          <InfoField
            label="Order Date"
            value={formatDate(order.created_at)}
            icon={<Timer className="text-gray-600" size={18} />}
          />
        </InfoCard>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Price Breakdown
        </h2>

        <div className="space-y-3 text-sm">
          <PriceItem
            label="Base Price"
            value={formatPrice(
              String(
                Number(Number(order?.base_price) ?? 0) +
                  (Number(order.stops?.length ?? 0) * 20)
              )
            )}
          />

          {order.discount && parseFloat(order.discount) > 0 && (
            <PriceItem
              label="Discount"
              value={`- ${formatPrice(order.discount)}`}
              isDiscount
            />
          )}

          {order.gratuity && parseFloat(order.gratuity) > 0 && (
            <PriceItem label="Gratuity" value={formatPrice(order.gratuity)} />
          )}

          {order.is_meet_greet_price && parseFloat(order.is_meet_greet_price) > 0 && (
            <PriceItem
              label="Meet & Greet"
              value={formatPrice(order.is_meet_greet_price)}
            />
          )}

          {order.rear_seat_price && parseFloat(order.rear_seat_price) > 0 && (
            <PriceItem
              label="Rear Seats"
              value={formatPrice(order.rear_seat_price)}
            />
          )}

          {order.infant_seat_price && parseFloat(order.infant_seat_price) > 0 && (
            <PriceItem
              label="Infant Seats"
              value={formatPrice(order.infant_seat_price)}
            />
          )}

          {order.booster_seat_price && parseFloat(order.booster_seat_price) > 0 && (
            <PriceItem
              label="Booster Seats"
              value={formatPrice(order.booster_seat_price)}
            />
          )}

          {order.return_price && parseFloat(order.return_price) > 0 && (
            <PriceItem
              label="Return Transfer"
              value={formatPrice(order.return_price)}
            />
          )}

          {order.is_return_meet_greet_price &&
            parseFloat(order.is_return_meet_greet_price) > 0 && (
              <PriceItem
                label="Return Meet & Greet"
                value={formatPrice(order.is_return_meet_greet_price)}
              />
            )}

          {order.return_rear_seat_price &&
            parseFloat(order.return_rear_seat_price) > 0 && (
              <PriceItem
                label="Return Rear Seats"
                value={formatPrice(order.return_rear_seat_price)}
              />
            )}

          {order.return_infant_seat_price &&
            parseFloat(order.return_infant_seat_price) > 0 && (
              <PriceItem
                label="Return Infant Seats"
                value={formatPrice(order.return_infant_seat_price)}
              />
            )}

          {order.return_booster_seat_price &&
            parseFloat(order.return_booster_seat_price) > 0 && (
              <PriceItem
                label="Return Booster Seats"
                value={formatPrice(order.return_booster_seat_price)}
              />
            )}

          {order.tax && parseFloat(order.tax) > 0 && (
            <PriceItem label="Tax" value={formatPrice(order.tax)} />
          )}
        </div>

        <div className="flex justify-between items-center border-t-2 border-dashed border-gray-300 mt-6 pt-4 text-lg font-bold text-gray-900">
          <span>Total Amount</span>
          <span className="text-green-600">{formatPrice(order.total_price)}</span>
        </div>
      </div>
    </div>
  );
}

/* Helper Components */

interface SummaryCardProps {
  label: string;
  value: string;
  color?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 text-center shadow-sm hover:shadow-md transition-shadow">
    <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
    <p className={`text-xl font-bold ${color || "text-gray-800"}`}>{value}</p>
  </div>
);

interface TimelineItemProps {
  color: string;
  label: string;
  value?: string;
  date?: string | null;
  time?: string | null;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  color,
  label,
  value,
  date,
  time,
}) => (
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
      <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded border">
        {value}
      </p>
    </div>
  </div>
);

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

interface InfoFieldProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onCopy?: () => void;
  copied?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  icon,
  onCopy,
  copied = false,
}) => (
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
);

interface PriceItemProps {
  label: string;
  value: string;
  isDiscount?: boolean;
}

const PriceItem: React.FC<PriceItemProps> = ({
  label,
  value,
  isDiscount = false,
}) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-gray-600">{label}</span>
    <span
      className={`font-medium ${isDiscount ? "text-red-600" : "text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

/* Utility Functions */

function formatDate(date?: string | null): string {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function formatTime(time?: string | null): string {
  if (!time) return "N/A";
  try {
    const [hours24, minutes] = time.split(":");
    const hours24Int = parseInt(hours24);

    if (isNaN(hours24Int) || isNaN(parseInt(minutes))) {
      return time;
    }

    let hours12: number;
    let period: string;

    if (hours24Int === 0) {
      hours12 = 12;
      period = "AM";
    } else if (hours24Int === 12) {
      hours12 = 12;
      period = "PM";
    } else if (hours24Int > 12) {
      hours12 = hours24Int - 12;
      period = "PM";
    } else {
      hours12 = hours24Int;
      period = "AM";
    }

    return `${hours12}:${minutes.padStart(2, "0")} ${period}`;
  } catch {
    return time || "N/A";
  }
}

