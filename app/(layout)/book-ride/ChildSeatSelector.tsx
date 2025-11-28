'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import useFormStore from '@/stores/FormStore';

interface ChildSeat {
  id: string;
  type: 'rear' | 'booster' | 'infant';
  quantity: number;
}

interface ChildSeatSelectorProps {
  rearSeatField: 'rearSeat' | 'returnRearSeat';
  boosterSeatField: 'boosterSeat' | 'returnBoosterSeat';
  infantSeatField: 'infantSeat' | 'returnInfantSeat';
}

const seatTypeOptions = [
  { value: 'infant', label: 'Rear Facing Seat (Infant)' },
  { value: 'rear', label: 'Forward Facing Seat (Toddler)' },
  { value: 'booster', label: 'Booster Seat' },
] as const;

function ChildSeatSelector({ 
  rearSeatField, 
  boosterSeatField, 
  infantSeatField 
}: ChildSeatSelectorProps) {
  const { formData, setFormData } = useFormStore();
  const [childSeats, setChildSeats] = useState<ChildSeat[]>([]);

  // Initialize child seats from form data (only on mount)
  useEffect(() => {
    const seats: ChildSeat[] = [];
    const rearCount = formData[rearSeatField].value || 0;
    const boosterCount = formData[boosterSeatField].value || 0;
    const infantCount = formData[infantSeatField].value || 0;

    if (rearCount > 0) {
      seats.push({ id: `rear-${Date.now()}-${Math.random()}`, type: 'rear', quantity: rearCount });
    }
    if (boosterCount > 0) {
      seats.push({ id: `booster-${Date.now()}-${Math.random()}`, type: 'booster', quantity: boosterCount });
    }
    if (infantCount > 0) {
      seats.push({ id: `infant-${Date.now()}-${Math.random()}`, type: 'infant', quantity: infantCount });
    }

    if (seats.length > 0) {
      setChildSeats(seats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update form store when child seats change
  useEffect(() => {
    const rearTotal = childSeats
      .filter(seat => seat.type === 'rear')
      .reduce((sum, seat) => sum + seat.quantity, 0);
    const boosterTotal = childSeats
      .filter(seat => seat.type === 'booster')
      .reduce((sum, seat) => sum + seat.quantity, 0);
    const infantTotal = childSeats
      .filter(seat => seat.type === 'infant')
      .reduce((sum, seat) => sum + seat.quantity, 0);

    setFormData(rearSeatField, rearTotal);
    setFormData(boosterSeatField, boosterTotal);
    setFormData(infantSeatField, infantTotal);
  }, [childSeats, rearSeatField, boosterSeatField, infantSeatField, setFormData]);

  const handleAddSeat = () => {
    const newSeat: ChildSeat = {
      id: `booster-${Date.now()}-${Math.random()}`,
      type: 'booster',
      quantity: 1,
    };

    setChildSeats([...childSeats, newSeat]);
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setChildSeats(prevSeats =>
      prevSeats.map(seat => {
        if (seat.id === id) {
          const newQuantity = Math.max(0, seat.quantity + delta);
          return { ...seat, quantity: newQuantity };
        }
        return seat;
      }).filter(seat => seat.quantity > 0)
    );
  };

  const handleDeleteSeat = (id: string) => {
    setChildSeats(prevSeats => prevSeats.filter(seat => seat.id !== id));
  };

  const getSeatLabel = (type: string) => {
    return seatTypeOptions.find(opt => opt.value === type)?.label || '';
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Add Child Seat Link */}
      <button
        onClick={handleAddSeat}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium self-start cursor-pointer"
      >
        + Add Child Seat
      </button>

      {/* Child Seat Rows */}
      <div className="flex flex-col gap-2">
        {childSeats.map((seat) => (
          <div
            key={seat.id}
            className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white"
          >
            {/* Seat Type Dropdown */}
            <div className="flex-1">
              <Select
                value={seat.type}
                onValueChange={(newType) => {
                  setChildSeats(prevSeats =>
                    prevSeats.map(s =>
                      s.id === seat.id
                        ? { ...s, type: newType as 'rear' | 'booster' | 'infant' }
                        : s
                    )
                  );
                }}
              >
                <SelectTrigger className="p-2 rounded-md w-full border border-gray-300 bg-white flex items-center gap-2">
                  <SelectValue>{getSeatLabel(seat.type)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {seatTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-0 border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => handleQuantityChange(seat.id, -1)}
                className="p-1.5 hover:bg-gray-100 transition-colors flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={seat.quantity}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setChildSeats(prevSeats =>
                    prevSeats.map(s =>
                      s.id === seat.id ? { ...s, quantity: value } : s
                    ).filter(s => s.quantity > 0)
                  );
                }}
                className="w-12 text-center border-0 border-l border-r border-gray-300 focus:outline-none focus:ring-0 py-1"
                min="0"
              />
              <button
                onClick={() => handleQuantityChange(seat.id, 1)}
                className="p-1.5 hover:bg-gray-100 transition-colors flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteSeat(seat.id)}
              className="p-2 hover:bg-red-50 rounded-md transition-colors text-red-600"
              aria-label="Delete seat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChildSeatSelector;

