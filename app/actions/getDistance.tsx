"use server";

export async function calculateDistance({
  from,
  to,
  stops,
}: {
  from: string;
  to: string;
  stops: string[];
}) {
  try {
    if (!from || !to) {
      return { error: 'Both "from" and "to" parameters are required.' };
    }


    // Create route chain — always start from 'from' and end at 'to'
    const routePoints = [from, ...stops, to];

    let totalDistanceMeters = 0;

    // Loop through all route legs (e.g., from->stop1, stop1->stop2, ..., stop3->to)
    for (let i = 0; i < routePoints.length - 1; i++) {
      const origin = routePoints[i];
      const destination = routePoints[i + 1];

      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
        origin
      )}&destinations=${encodeURIComponent(
        destination
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        return { error: "Failed to fetch distance data from Google Maps API.", status: 500 };
      }

      const data = await response.json();
      const element = data.rows[0]?.elements[0];

      if (!element || element.status !== "OK") {
        return { error: `Failed to calculate distance between "${origin}" and "${destination}".`, status: 500 };
      }

      totalDistanceMeters += element.distance.value;
    }

    const distanceInKm = totalDistanceMeters / 1000;
    const distanceInMiles = totalDistanceMeters / 1609.34;

    return {
      kmDistance: Number(distanceInKm.toFixed(2)),
      mileDistance: Number(distanceInMiles.toFixed(2)),
      status: 200,
      error: "",
    };
  } catch (error) {
    console.error("Error calculating distance:", error);
    return { error: "An error occurred while calculating distance.", status: 500 };
  }
}
