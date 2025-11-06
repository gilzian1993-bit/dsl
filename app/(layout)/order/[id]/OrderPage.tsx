'use client';

import React, { useEffect, useState } from 'react';
import { getOrderById } from '@/actions/get-order-by-id';
import { TbCopy } from 'react-icons/tb';
import {
  MdOutlineFlight,
  MdOutlineEmail,
  MdOutlinePhone,
  MdOutlinePayment,
} from 'react-icons/md';
import { IoCarSportSharp } from 'react-icons/io5';
import { BiUserCircle } from 'react-icons/bi';
import useFormStore from '@/stores/FormStore';
import Image from 'next/image';



export interface OrderProps {
  id: number;

  // 🔹 Basic Info
  payment_id: string | null;
  name: string;
  email: string;
  phone_number: string;

  // 🔹 Route Info
  from_location: string;
  to_location: string;
  stops: string[] | null;
  pickup_date: string | null;
  pickup_time: string | null;
  return_date: string | null;
  return_time: string | null;

  // 🔹 Passenger Info
  passengers: number | null;
  luggage: number | null;

  // 🔹 Flight Info
  flight_number: string | null;
  airline_code: string | null;

  // 🔹 Car & Trip Info
  car_type: string | null;
  return_trip: boolean | null;
  trip_type: string | null; // "return" | "oneway"
  hours: string | null;
  distance: string | null;

  // 🔹 Seats
  rear_seats: number | null;
  booster_seats: number | null;
  infant_seat: number | null;
  return_rear_seats: number | null;
  return_booster_seats: number | null;
  return_infant_seat: number | null;

  // 🔹 Meet & Greet
  meet_greet: boolean | null;
  return_meet_greet: boolean | null;

  // 🔹 Pricing
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

  // 🔹 Optional Flags
  is_airport_pickup: boolean | null;
  is_flight_track: boolean | null;

  // 🔹 Extra Info
  category: string | null;
  car_image: string | null;

  // 🔹 Timestamps
  created_at: string;
}



function OrderPage({ id }: { id: string }) {
  const [order, setOrder] = useState<OrderProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resetForm, isOrderDone } = useFormStore();

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      const result = await getOrderById(id);
      if (result.status === 200 && result.order) {
        const orderData = result.order;

        // Convert Date fields to string
        const formattedOrder = {
          ...orderData,
          pickup_date: orderData.pickup_date ? new Date (orderData.pickup_date).toISOString() : null,
          return_date: orderData.return_date ? new Date (orderData.return_date).toISOString() : null,
          created_at: orderData.created_at ? orderData.created_at.toISOString() : "",
        };

        setOrder(formattedOrder);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.log("error : ", err);
      setError("Failed to fetch the order.");
    }
  };

  if (id) fetchOrder();
}, [id]);


  useEffect(() => {
    if (isOrderDone) resetForm();
  }, []);

  const toMiles = (km?: string | null) => {
    const num = parseFloat(km || '0');
    return isNaN(num) ? '0' : (num * 0.621371).toFixed(2);
  };

  if (error)
    return (
      <div className="text-center py-40 text-2xl text-red-500">{error}</div>
    );

  if (!order)
    return (
      <div className="text-center py-40 text-2xl animate-pulse">
        Loading...
      </div>
    );

  const stops = order.stops || [];

  return (
    <div className="min-h-screen bg-gray-50  text-wrap break-all ">
      <div className='h-14 sm:h-20 w-full bg-black mb-10' ></div>
      {/* Header */}
      <div className='px-3'>

      
      <header className="bg-[#181818] text-white flex justify-between items-center px-6 sm:px-10 py-5 max-w-5xl mx-auto rounded-2xl">
       <Image
                      src="/Logo.png"
                      alt="DSL Logo"
                      width={120}
                      height={60}
                      className='max-w-16 sm:max-w-32 object-contain'
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
          <SummaryCard
            label="Total Amount"
            value={`£${Number(order.total_price).toFixed(2)}`}
            color="text-red-600"
          />
          {order.category==='hourly' ? <SummaryCard
            label="Duration"
            value={`${order.hours} hours`}
          /> :
            <SummaryCard
            label="Distance"
            value={`${toMiles(order.distance?.toString())} miles`}
          />}
          <SummaryCard label="Trip Type" value={order.category?.toLowerCase() ?? 'N/A' } />
        </div>

        {/* Route Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IoCarSportSharp className="text-brandColor text-xl" /> Route
            Information
          </h2>

          <div className="relative pl-6">
            {/* Pickup */}
            <TimelineItem
              color="green"
              label="Pick-Up"
              value={order.from_location}
              date={order.pickup_date}
              time={order.pickup_time}
            />

            {/* Stops */}
            {stops.map((stop, i) => (
              <TimelineItem
                key={i}
                color="blue"
                label={`Stop ${i + 1}`}
                value={stop}
              />
            ))}

            {/* Drop-off */}
            { order.category === 'hourly' ? 
             <TimelineItem
              color="red"
              label="Duration"
              value={order.hours?.toString() || 'N/A'}
            />
            :
              <TimelineItem
              color="red"
              label="Drop-Off"
              value={order.to_location || 'N/A'}
            />}
          </div>
        </div>

        {/* Trip + Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Trip Details */}
          <InfoCard title="Trip Details">
            <InfoField
              label="Return Date"
              value={formatDate(order.return_date)}
            />
            <InfoField label="Return Time" value={order.return_time || 'N/A'} />
            <InfoField
              label="Flight Track"
              value={order.is_flight_track ? 'Yes' : 'No'}
            />
            <InfoField
              label="Meet & Greet"
              value={order.meet_greet ? 'Yes' : 'No'}
            />
          </InfoCard>

          {/* Customer Info */}
          <InfoCard title="Customer Information">
            <InfoField
              label="Name"
              value={order.name}
              icon={<BiUserCircle />}
            />
            <InfoField
              label="Email"
              value={order.email}
              icon={<MdOutlineEmail />}
            />
            <InfoField
              label="Phone"
              value={order.phone_number}
              icon={<MdOutlinePhone />}
            />
            <InfoField
              label="Flight Number"
              value={order.flight_number || 'N/A'}
              icon={<MdOutlineFlight />}
            />
          </InfoCard>
        </div>

        {/* Payment Info */}
        <InfoCard title="Payment Information">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoField
              label="Payment Method"
              value={'Card'}
              icon={<MdOutlinePayment />}
            />
            <InfoField label="Payment ID" value={order.payment_id || 'N/A'} />
            <InfoField
              label="Ordered At"
              value={formatDate(order.created_at.toString())}
            />
          </div>
        </InfoCard>
      </main>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

const SummaryCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <div className="bg-[#fff9ef] border border-yellow-200 rounded-xl p-4 flex flex-col justify-center text-center">
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <p className={`text-xl font-bold ${color || 'text-gray-800'} mt-1`}>
      {value}
    </p>
  </div>
);

const TimelineItem = ({
  color,
  label,
  value,
  date,
  time,
}: {
  color: string;
  label: string;
  value?: string;
  date?: string | null;
  time?: string | null;
}) => (
  <div className="relative pb-6">
    {/* Vertical Line */}
    {/* <div className="absolute left-[7px] top-3 bottom-0 w-[2px] bg-gray-200"></div> */}

    {/* Icon Circle */}
    <div
      className={`absolute -left-0.5 w-4 h-4 top-1 rounded-full`}
      style={{ backgroundColor: color }}
    ></div>

    <div className="ml-6">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      {date && (
        <p className="text-xs text-gray-500">
          {formatDate(date)} • {time || 'N/A'}
        </p>
      )}
      <p className="text-sm text-gray-700 mt-1">{value}</p>
    </div>
  </div>
);

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6">
    <h3 className="text-md font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

const InfoField = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-2">
    {icon && <span className="text-gray-500 text-lg mt-0.5">{icon}</span>}
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-gray-800 font-medium text-sm">{value}</p>
    </div>
  </div>
);

/* ---------- Utils ---------- */

function formatDate(date?: string | null) {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

export default OrderPage;
