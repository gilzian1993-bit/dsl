'use client';
import React, { useState } from 'react';
import { Mail, Phone, House, MapPin } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Show loading toast
        const toastId = toast.loading('Sending message...');

        try {
            const response = await fetch('https://devsquare-apis.vercel.app/api/dslLimoService/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Something went wrong!');

            const data = await response.json();

            // Update toast to success
            toast.success(data.message || 'Message sent successfully!', { id: toastId });

            // Clear form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, { id: toastId });
            } else {
                toast.error('Failed to send message!', { id: toastId });
            }
        } finally {
            // ✅ Reset loading state
            setIsSubmitting(false);
        }
    };

    return (
        <div className=" mx-auto max-w-5xl ">
            <Toaster position="top-right" reverseOrder={false} />
            <div className=" max-w-7xl flex flex-col md:flex-row md:space-x-12 px-6 py-16">
                {/* Left: Contact Form */}
                <div className="flex-1 md:pr-12">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Please fulfil the form below.</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Your Name (required)</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full h-10 px-3 border border-gray-200 rounded bg-white focus:border-gray-400 focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Your Email (required)</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full h-10 px-3 border border-gray-200 rounded bg-white focus:border-gray-400 focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full h-10 px-3 border border-gray-200 rounded bg-white focus:border-gray-400 focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Your Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={7}
                                className="w-full px-3 py-2 border border-gray-200 rounded bg-white resize-none focus:border-gray-400 focus:ring-0"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-2 rounded font-medium shadow-sm transition flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            )}
                            {isSubmitting ? 'Sending...' : 'Send'}
                        </button>

                    </form>
                </div>
                {/* Right: Info & Social */}
                <div className="w-full md:w-1/2 max-w-md mt-12 md:mt-0 md:pl-12 flex flex-col gap-10">
                    <div>
                        <h3 className="text-xs font-bold text-gray-700 mb-2 tracking-wider uppercase">Before Contacting Us</h3>
                        <p className="text-sm text-gray-600">
                            DSL Limo offers top-rated limousine and car services in New York and New Jersey, with professional, licensed drivers. We ensure secure, memorable rides to airports or nearby states at reasonable rates. With a vast network and quick response time, customer satisfaction is our top priority.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-700 mb-2 tracking-wider uppercase">Contact Information</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-start gap-4">
                               <MapPin className="w-4 h-4 text-black  flex-shrink-0" />
                                3193 Washington Rd, Parlin, NJ 08859, USA
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="w-4 h-4  flex-shrink-0" />
                               <a  href="tel:+18006793415">+1 800 679 3415</a> 
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                               <a href="mailto:info@dsllimoservice.com">info@dsllimoservice.com</a> 
                            </div>
                           
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-700 mb-2 tracking-wider uppercase">Social Media</h3>
                        <div className="flex gap-3">
                            <a href="https://www.facebook.com/share/19umZJX6Cc/?mibextid=wwXIfr" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition">
                                <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
                            </a>
                           
                            <a href="https://www.instagram.com/dsl_limo25?igsh=c3A5eXY4NjlnYXN2&utm_source=qr" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition">
                                <img src="/instagram.svg" alt="Instagram" className="w-5 h-5" />
                            </a>
                            
                        </div>
                    </div>
                </div>
            </div>

          

        </div>
    );

};

export default ContactSection;