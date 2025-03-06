import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE_URL = "https://maps.googleapis.com/maps/api";

export const getCoordinates = async (address) => {
    try {
        const encodedAddress = encodeURIComponent(address);

        if (!GOOGLE_MAPS_API_KEY) {
            console.error(
                "Google Maps API key is not defined in environment variables."
            );
            return null;
        }

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.results.length === 0) {
            console.error("No results found for the address");
            return null;
        }

        const location = response.data.results[0]?.geometry.location;

        if (location) {
            return { lat: location.lat, lng: location.lng };
        } else {
            console.error("No location found in the response");
            return null;
        }
    } catch (error) {
        console.error("Error occurred while fetching coordinates:", error);
        return null;
    }
};

export const getRoute = async (origin, destination) => {
    const response = await axios.get(`${BASE_URL}/directions/json`, {
        params: {
            origin: `${origin.lat},${origin.lng}`,
            destination: `${destination.lat},${destination.lng}`,
            key: GOOGLE_MAPS_API_KEY,
        },
    });
    return response.data.routes[0]?.legs[0]?.steps.map(
        (step) => step.end_location
    );
};
