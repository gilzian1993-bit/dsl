import React from "react";

export default function ErrorPopup({ message }: { message: string }) {
  return (
    <div className="text-red-500 text-xs mt-1 bg-red-50 px-2 py-1 rounded border border-red-300 shadow-sm">
      {message}
    </div>
  );
}