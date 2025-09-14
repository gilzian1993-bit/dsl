
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <Card className="max-w-md w-full text-center shadow-xl border-0">
                <CardContent className="p-8">
                    {/* ✅ Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    {/* ✅ Heading */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Registration Submitted
                    </h2>

                    {/* ✅ Description */}
                    <p className="text-gray-600 mb-4">
                        Thank you for registering with <strong>Yeshiva Transit Solutions</strong>.  
                        Your request has been received and is under review.
                    </p>

                    {/* ✅ Confirmation Info */}
                    <p className="text-sm text-green-800 bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
                        📧 A confirmation email has been sent.  
                        We’ll get back to you within 2–3 business days with your route confirmation.
                    </p>

                    {/* ✅ Return Home Button */}
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => (window.location.href = "/")}
                    >
                        Return to Homepage
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
