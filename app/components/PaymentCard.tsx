import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";

export default function PaymentCard({ amount }: { amount: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/create-payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount }),
                });
                if (!res.ok) throw new Error("Failed to create payment intent");
                const data = await res.json();
                console.log("Client Secret:", data.clientSecret);
                setClientSecret(data.clientSecret);
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        })();
    }, [amount]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!stripe || !elements || !clientSecret) return;

  setLoading(true);

  // ✅ 1️⃣ First submit the elements (collects and validates input)
  const { error: submitError } = await elements.submit();
  if (submitError) {
    setErrorMessage(submitError.message ?? "Payment details invalid");
    setLoading(false);
    return;
  }

  // ✅ 2️⃣ Then confirm the payment
  const { error } = await stripe.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      return_url: `${window.location.origin}/payment-success`,
    },
  });

  if (error) {
    setErrorMessage(error.message || "Payment failed");
    setLoading(false);
  }
};



    if (!clientSecret) {
        return <p className="text-gray-500">Loading payment form…</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement className="p-3 border rounded-md" />

            {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-[#008492] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#006d77] transition"
            >
                {loading ? "Processing..." : "Pay"}
            </button>
        </form>
    );
}
