import Image from "next/image";
import { useRouter } from "next/navigation";


export default function PaymentSuccessPage() {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/"); // or any route
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <Image src="/success.png" alt="Success" width={120} height={120} />
            <h1 className="mt-6 text-3xl font-bold text-teal-600">Payment Successful!</h1>
            <p className="mt-2 text-gray-600 text-center">
                Your payment has been processed successfully. You can now access your dashboard.
            </p>

            {/* Client Component handles the click */}
            <div className="mt-6">
                <button onClick={handleGoHome} />
            </div>
        </div>
    );
}
