'use client';
import React from 'react';
import useFormStore from '@/stores/FormStore';
import MyPaymentForm from './PaymentForm';
import BackButton from './BackButton';

function Step4() {
  const { formData } = useFormStore();

  const {
    basePrice,
    graduatiy,
    tax,
    discount,
    isMeetGreetPrice,
    rearSeatPrice,
    infantSeatPrice,
    boosterSeatPrice,
    returnPrice,
    isReturnMeetGreetPrice,
    returnRearSeatPrice,
    returnInfantSeatPrice,
    returnBoosterSeatPrice,
    totalPrice,
    stopsPrice,
    isAirportPickupPrice
  } = formData;

  const formatPrice = (price: number) => (price > 0 ? `$ ${price.toFixed(2)}` : '—');

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="font-bold text-xl">Invoice Summary</div>

      <div className="flex flex-col gap-4 bg-gray-50 rounded-2xl p-4 shadow">
        <div className="font-semibold text-lg">Price Breakdown</div>

        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Base Price</span>
            <span>{formatPrice(basePrice.value + stopsPrice.value)}</span>
          </div>
          {discount.value > 0 && (
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- {formatPrice(discount.value)}</span>
            </div>
          )}
          {graduatiy.value > 0 && (
            <div className="flex justify-between">
              <span>Graduity</span>
              <span>{formatPrice(graduatiy.value)}</span>
            </div>
          )}
          
          {isAirportPickupPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Airport Pickup</span>
              <span>{formatPrice(isAirportPickupPrice.value)}</span>
            </div>
          )}
          {isMeetGreetPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Meet & Greet</span>
              <span>{formatPrice(isMeetGreetPrice.value)}</span>
            </div>
          )}
          {rearSeatPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Rear Seat</span>
              <span>{formatPrice(rearSeatPrice.value)}</span>
            </div>
          )}
          {infantSeatPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Infant Seat</span>
              <span>{formatPrice(infantSeatPrice.value)}</span>
            </div>
          )}
          {boosterSeatPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Booster Seat</span>
              <span>{formatPrice(boosterSeatPrice.value)}</span>
            </div>
          )}
          {returnPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Return Transfer</span>
              <span>{formatPrice(returnPrice.value)}</span>
            </div>
          )}
          {isReturnMeetGreetPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Return Meet & Greet</span>
              <span>{formatPrice(isReturnMeetGreetPrice.value)}</span>
            </div>
          )}
          {returnRearSeatPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Return Rear Seat</span>
              <span>{formatPrice(returnRearSeatPrice.value)}</span>
            </div>
          )}
          {returnInfantSeatPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Return Infant Seat</span>
              <span>{formatPrice(returnInfantSeatPrice.value)}</span>
            </div>
          )}
          {returnBoosterSeatPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Return Booster Seat</span>
              <span>{formatPrice(returnBoosterSeatPrice.value)}</span>
            </div>
          )}
          {/* {stopsPrice.value > 0 && (
            <div className="flex justify-between">
              <span>Stops</span>
              <span>{formatPrice(stopsPrice.value)}</span>
            </div>
          )} */}
          {tax.value > 0 && (
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>{formatPrice(tax.value)}</span>
            </div>
          )}
          
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border-t border-dashed border-gray-400 mt-3 pt-3 text-xl font-bold text-black">
          <span>Total</span>
          <span>$ {totalPrice.value.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Form */}
      <MyPaymentForm price={totalPrice.value.toFixed(2)} />

      {/* Back Button */}
      <BackButton step={4} />
    </div>
  );
}

export default Step4;
