"use client";

import Image from "next/image";



export default function PaymentSuccessPage() {



    return (
        <div className="flex flex-col items-center justify-center my-15 ">
            <Image src="/success-icon.svg" alt="Success" width={120} height={120} />
            <h1 className="mt-4 text-3xl font-bold text-black">You&apos;re All Set!</h1>
            <p className="mt-2 text-gray-600 text-center">
                Thank You for booking with DSL Limo Services. We&apos;ve sent you a confirmation email with all the details.
            </p>



        </div>
    );
}
