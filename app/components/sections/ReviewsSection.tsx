"use client";

import React, { useEffect, useState } from "react";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

interface Review {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface ReviewsData {
  reviews: Review[];
  rating?: number;
  totalRatings?: number;
}

export default function ReviewsSection() {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviewsData(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Unable to load reviews at this time");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const slidesToShow = isMobile ? 1 : 3;
  const reviews = reviewsData?.reviews || [];
  const maxIndex = Math.max(0, reviews.length - slidesToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const newMaxIndex = Math.max(0, reviews.length - (isMobile ? 1 : 3));
      return prev >= newMaxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const newMaxIndex = Math.max(0, reviews.length - (isMobile ? 1 : 3));
      return prev <= 0 ? newMaxIndex : prev - 1;
    });
  };

  // Swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Reset index when screen size or reviews change
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile, reviews.length]);

  // Auto scroll
  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const newMaxIndex = Math.max(0, reviews.length - (isMobile ? 1 : 3));
        return prev >= newMaxIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length, isMobile]);

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !reviewsData || !reviewsData.reviews || reviewsData.reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-400 max-w-24"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 whitespace-nowrap">
              CUSTOMER REVIEWS
            </h2>
            <div className="flex-1 h-px bg-gray-400 max-w-24"></div>
          </div>
          {reviewsData.rating && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-lg font-semibold text-gray-900">
                {reviewsData.rating.toFixed(1)}
              </span>
              <div className="flex items-center gap-1">
                {renderStars(Math.round(reviewsData.rating))}
              </div>
              
              {/* {reviewsData.totalRatings && (
                <span className="text-gray-600">
                  ({reviewsData.totalRatings} reviews)
                </span>
              )} */}
            </div>
          )}
        </div>

        {/* Reviews Slider */}
        <div className="relative w-full flex items-center justify-center">
          {/* Left Arrow - Hidden on mobile */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2
              w-10 h-10 rounded-full items-center justify-center 
              border-2 border-gray-300 bg-white hover:bg-gray-50 
              shadow-md hover:shadow-lg transition-all z-10"
            aria-label="Previous review"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Mobile Slider - Swipeable */}
          <div 
            className="block md:hidden w-full max-w-sm overflow-hidden relative touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full px-2"
                >
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                    {/* Reviewer Info */}
                    <div className="flex items-center gap-3 mb-4">
                      {review.profile_photo_url ? (
                        <Image
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {review.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {review.author_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {review.relative_time_description}
                        </p>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.text}
                    </p>

                    {/* Google Link */}
                    {review.author_url && (
                      <a
                        href={review.author_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1EACC7] text-xs mt-3 inline-block hover:underline"
                      >
                        View on Google
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Slider */}
          <div className="hidden md:block w-full max-w-5xl overflow-hidden relative">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-1/3 px-3"
                >
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                    {/* Reviewer Info */}
                    <div className="flex items-center gap-3 mb-4">
                      {review.profile_photo_url ? (
                        <Image
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {review.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {review.author_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {review.relative_time_description}
                        </p>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                      {review.text}
                    </p>

                    {/* Google Link */}
                    {review.author_url && (
                      <a
                        href={review.author_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1EACC7] text-xs mt-3 inline-block hover:underline"
                      >
                        View on Google
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow - Hidden on mobile */}
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2
              w-10 h-10 rounded-full items-center justify-center 
              border-2 border-gray-300 bg-white hover:bg-gray-50 
              shadow-md hover:shadow-lg transition-all z-10"
            aria-label="Next review"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Slider Indicators */}
        {reviews.length > slidesToShow && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-[#008492]"
                    : "w-2 bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Reviews Link */}
        <div className="text-center mt-8">
          <a
            href="https://www.google.com/search?sca_esv=edb4ab9214abdc96&hl=en&authuser=0&sxsrf=AE3TifMRMZBZ5ayxfoXK0ndI33j1uufA2Q%3A1765483082179&kgmid=%2Fg%2F11zj4vxxq9&q=DSL%20Limo%20service&shndl=30&shem=bdslc%2Cdamc%2Cptotple&source=sh%2Fx%2Floc%2Fact%2Fm4%2F3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#008492] text-white font-semibold rounded px-6 py-3 hover:bg-[#006d7a] transition"
          >
            View All Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}

