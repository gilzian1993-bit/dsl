"use server";

export async function calculateDistance({
  from,
  to,
  stops = [],
}: {
  from: string;
  to: string;
  stops?: string[];
}) {
  try {
    if (!from || !to) {
      return { error: 'Both "from" and "to" parameters are required.' };
    }

    // Build destinations string (drop + all stops)
    const destinations = [to, ...stops].filter(Boolean).join("|");

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(
      from
    )}&destinations=${encodeURIComponent(destinations)}&key=YOUR_GOOGLE_API_KEY`;

    const response = await fetch(url);

    if (!response.ok) {
      return {
        error: "Failed to fetch distance data from Google Maps API.",
        status: 500,
      };
    }

    const data = await response.json();

    // Each element corresponds to a leg from `from` → each destination
    const elements = data.rows?.[0]?.elements;
    if (!elements || !elements.length) {
      return { error: "Invalid response from Google API.", status: 500 };
    }

    let totalDistanceInMiles = 0;
    for (const element of elements) {
      if (element.status === "OK") {
        totalDistanceInMiles += element.distance.value / 1609.34; // meters → miles
      } else {
        return {
          error: "One of the locations could not be reached.",
          status: 500,
        };
      }
    }

    return { distance: totalDistanceInMiles, status: 200, error: "" };
  } catch (error) {
    console.error("Error calculating distance:", error);
    return {
      error: "An error occurred while calculating distance.",
      status: 500,
    };
  }
}
