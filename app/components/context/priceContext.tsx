// context/PriceContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PriceContextType {
  totalPrice: number;
  setTotalPrice: (price: number) => void;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider = ({ children }: { children: ReactNode }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <PriceContext.Provider value={{ totalPrice, setTotalPrice }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrice = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error("usePrice must be used within a PriceProvider");
  }
  return context;
};
