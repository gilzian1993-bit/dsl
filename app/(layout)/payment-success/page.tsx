"use client";
import MapComponent from "@/app/components/formComponent/GoogleMap";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";


export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const pickupLat = Number(searchParams.get("pickupLat") || "0");
    const pickupLng = Number(searchParams.get("pickupLng") || "0");
    const dropLat = Number(searchParams.get("dropLat") || "0");
    const dropLng = Number(searchParams.get("dropLng") || "0");
    const router = useRouter();
    const mapCenter = pickupLat && pickupLng ? { lat: pickupLat, lng: pickupLng } : { lat: 34.0522, lng: -118.2437 }; // Default to LA


    return (
        <div className="flex flex-col items-center justify-center my-15 ">
            <Image src="/success-icon.svg" alt="Success" width={120} height={120} />
            <h1 className="mt-4 text-3xl font-bold text-black">You&apos;re All Set!</h1>
            <p className="mt-2 text-gray-600 text-center">
                Your taxi is booked. We&apos;ve sent you a confirmation email with all the details.
            </p>



        </div>
    );
}
