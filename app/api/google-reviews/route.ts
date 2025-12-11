import { NextResponse } from 'next/server';
import { GOOGLE_MAPS_API_KEY } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

interface GoogleReview {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlaceDetails {
  reviews?: GoogleReview[];
  rating?: number;
  user_ratings_total?: number;
}

export async function GET() {
  try {
    // Search for DSL Limo Service by name and location
    // You can also set a specific Place ID here if you know it
    const BUSINESS_NAME = process.env.GOOGLE_PLACE_NAME || 'DSL Limo service';
    const PLACE_ID = process.env.GOOGLE_PLACE_ID; // Optional: Set this in .env if you have the Place ID
    
    let placeId = PLACE_ID;
    
    // If Place ID is not set, search for the business
    if (!placeId) {
      // Try searching by business name
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(BUSINESS_NAME)}&key=${GOOGLE_MAPS_API_KEY}`;
      
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (searchData.status === 'OK' && searchData.results && searchData.results.length > 0) {
        // Find the best match (preferably one with reviews)
        const bestMatch = searchData.results.find((result: any) => 
          result.user_ratings_total > 0
        ) || searchData.results[0];
        
        placeId = bestMatch.place_id;
      } else {
        return NextResponse.json(
          { 
            error: 'Business not found',
            message: 'Please set GOOGLE_PLACE_ID in your environment variables or ensure the business name is correct'
          },
          { status: 404 }
        );
      }
    }
    
    // Fetch place details including reviews
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(detailsUrl);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      return NextResponse.json(
        { 
          error: 'Failed to fetch reviews', 
          details: data.error_message || 'Unknown error',
          status: data.status
        },
        { status: 500 }
      );
    }
    
    const placeDetails: GooglePlaceDetails = data.result || {};
    const reviews = placeDetails.reviews || [];
    
    if (reviews.length === 0) {
      return NextResponse.json(
        { 
          reviews: [],
          rating: placeDetails.rating,
          totalRatings: placeDetails.user_ratings_total,
          message: 'No reviews available'
        },
        { status: 200 }
      );
    }
    
    // Sort reviews by time (newest first) and get latest 5
    const sortedReviews = reviews
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);
    
    return NextResponse.json({
      reviews: sortedReviews,
      rating: placeDetails.rating,
      totalRatings: placeDetails.user_ratings_total,
    });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

