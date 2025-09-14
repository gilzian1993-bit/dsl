"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"

const fleetCategories = [
    { name: "ALL" },
    { name: "SEDAN" },
    { name: "MID SUV" },
    { name: "SUV" },
    { name: "SPRINTER" },
]

const vehicles = [
    { id: 1, name: "CADILLAC XTS - SEDAN", type: "SEDAN", image: "/images/sedan/cadilac-xts.png" },
    { id: 2, name: "LINCOLN CONTINENTAL - SEDAN", type: "SEDAN", image: "/images/sedan/lincoln.png" },
    { id: 3, name: "CADILLAC CTS - SEDAN", type: "SEDAN", image: "/images/sedan/cadilac.cts.png" },
    { id: 4, name: "CADILLAC LYRIQ - SEDAN", type: "SEDAN", image: "/images/sedan/cadilac.png" },
    { id: 5, name: "Lincoln Aviator - MID SIZE SUV", type: "MID SUV", image: "/images/SUV/lincoln-aviator.png" },
    { id: 6, name: "Cadillac XT6 - MID SIZE SUV", type: "MID SUV", image: "/images/SUV/cadilac-xt6.png" },
    { id: 7, name: "Chevrolet Suburban - SUV", type: "SUV", image: "/images/SUV/chevrolet.png" },
    { id: 8, name: "Cadillac Escalade - SUV", type: "SUV", image: "/images/SUV/cadilac-escalate.png" },
    { id: 9, name: "GMC Yukon XL - SUV", type: "SUV", image: "/images/SUV/GMC.png" },
    { id: 10, name: "Lincoln Navigator - SUV", type: "SUV", image: "/images/SUV/lincol-navigator.png" },
    { id: 11, name: "Sprinter", type: "SPRINTER", image: "/images/spinter/spinter.png" },
]

export default function OurFleet() {
    const [activeCategory, setActiveCategory] = useState("ALL")
    const [startIndex, setStartIndex] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(3)
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

    // Adjust items per page based on screen size
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 768) setItemsPerPage(1)
            else setItemsPerPage(3)
        }
        updateItemsPerPage()
        window.addEventListener("resize", updateItemsPerPage)
        return () => window.removeEventListener("resize", updateItemsPerPage)
    }, [])

    const filteredVehicles =
        activeCategory === "ALL"
            ? vehicles
            : vehicles.filter((v) => v.type === activeCategory)
// Auto slide effect
useEffect(() => {
    const interval = setInterval(() => {
        setStartIndex((prevIndex) => {
            if (prevIndex + itemsPerPage < filteredVehicles.length) {
                return prevIndex + itemsPerPage
            } else {
                return 0 // reset to start when reaching the end
            }
        })
    }, 3000) // every 3 seconds

    return () => clearInterval(interval)
}, [filteredVehicles.length, itemsPerPage])

    const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage)

    const handleNext = () => {
        if (startIndex + itemsPerPage < filteredVehicles.length) setStartIndex(startIndex + itemsPerPage)
    }

    const handlePrev = () => {
        if (startIndex - itemsPerPage >= 0) setStartIndex(startIndex - itemsPerPage)
    }

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category)
        setStartIndex(0)
    }

    return (
        <section className="py-14 px-4 bg-white" ref={ref}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2
                        className="text-4xl font-bold text-gray-900 mb-4 opacity-0"
                        style={{
                            animation: inView ? "fadeInUp 0.6s ease-out forwards" : "none",
                        }}
                    >
                        OUR FLEET
                    </h2>
                    {/* Categories */}
                    <div className="flex justify-center items-center text-sm">
                        {fleetCategories.map((category, index) => (
                            <div key={category.name} className="flex items-center">
                                <button
                                    onClick={() => handleCategoryChange(category.name)}
                                    className={`px-2 py-1 transition-colors ${
                                        activeCategory === category.name
                                            ? "text-teal-500 font-medium"
                                            : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    {category.name}
                                </button>
                                {index < fleetCategories.length - 1 && (
                                    <span className="text-gray-300 mx-2">/</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fleet Grid */}
                <div className="relative">
                    <button
                        onClick={handlePrev}
                        disabled={startIndex === 0}
                        className={`absolute left-2 md:-left-8 top-1/2 -translate-y-1/2
                            w-8 h-8 rounded-full flex items-center justify-center
                            border-2 border-black bg-white shadow-md transition-colors z-10
                            ${startIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        <ArrowLeft className="w-4 h-4 text-black" />
                    </button>

                    <div
                        className={`mx-16 grid gap-8 ${itemsPerPage === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"}`}
                    >
                        {paginatedVehicles.map((vehicle, index) => (
                            <div
                                key={vehicle.id}
                                className="text-center  overflow-hidden  opacity-0"
                                style={{
                                    animation: inView
                                        ? `fadeInUp 0.6s ease-out forwards ${index * 0.1 + 0.2}s`
                                        : "none",
                                }}
                            >
                                <div className="relative h-60 w-full">
                                    <Image
                                        src={vehicle.image || "/placeholder.svg"}
                                        alt={vehicle.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="text-md font-bold text-gray-900 mt-2">{vehicle.name}</h3>
                                <p className="text-gray-500 text-sm">{vehicle.type}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={startIndex + itemsPerPage >= filteredVehicles.length}
                        className={`absolute top-1/2 -translate-y-1/2 right-2 md:-right-8
                            w-8 h-8 rounded-full flex items-center justify-center
                            border-2 border-black bg-white shadow-md transition-colors z-50
                            ${startIndex + itemsPerPage >= filteredVehicles.length ? "opacity-50" : "hover:bg-gray-100"}`}
                    >
                        <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    0% {
                        transform: translateY(10px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </section>
    )
}
