"use server";

export async function calculateDistance({
  from,
  to,
  stop1 = "",
  stop2 = "",
  stop3 = "",
  stop4 = "",
}: {
  from: string;
  to: string;
  stop1?: string;
  stop2?: string;
  stop3?: string;
  stop4?: string;
}) {
  try {
    // if (!from || !to) {
    //   return { error: 'Both "from" and "to" parameters are required.' };
    // }

    // Combine stops into the destinations string (if there are any stops)
    const destinations = [to, stop1, stop2, stop3, stop4].filter(Boolean).join('|');

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(destinations)}&key=AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU`;

    const response = await fetch(url);

    if (!response.ok) {
      return { error: "Failed to fetch distance data from Google Maps API.", status: 500 };
    }

    const data = await response.json();

    const elementStatus = data.rows[0]?.elements[0]?.status;

    if (elementStatus !== "OK") {
      return { error: "Invalid locations or unable to calculate distance.", status: 500 };
    }

    // Calculate the total distance by summing up the distances from each leg
    let totalDistanceInMiles = 0;
    for (const element of data.rows[0].elements) {
      if (element.status === "OK") {
        totalDistanceInMiles += Number(element.distance.value) / 1609.34;  // Convert meters to miles
      } else {
        return { error: "One of the locations could not be reached.", status: 500 };
      }
    }

    return { distance: totalDistanceInMiles, status: 200, error: '' };
  } catch (error) {
    console.error("Error calculating distance:", error);
    return { error: "An error occurred while calculating distance.", status: 500 };
  }
}  