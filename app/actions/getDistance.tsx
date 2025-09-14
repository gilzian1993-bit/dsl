"use server";

export async function calculateDistance({ from, to }: {
  from: string,
  to: string,

}) {
  try {


    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(
      from
    )}&destinations=${encodeURIComponent(to)}&key=AIzaSyDaQ998z9_uXU7HJE5dolsDqeO8ubGZvDU`;

    const response = await fetch(url);

    if (!response.ok) {
      return { error: "Failed to fetch distance data from Google Maps API.", status: 500 };
    }

    const data = await response.json();

    const elementStatus = data.rows[0]?.elements[0]?.status;

    if (elementStatus !== "OK") {
      return { error: "Invalid locations or unable to calculate distance.", status: 500 };
    }

    const distanceInMiles = Number(data.rows[0].elements[0].distance.value) / 1609.34;

    return { distance: distanceInMiles, status: 200, error: '' };
  } catch (error) {
    console.error("Error calculating distance:", error);
    return { error: "An error occurred while calculating distance.", status: 500 };
  }
}
