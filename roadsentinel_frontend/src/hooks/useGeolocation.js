import { useCallback, useState } from "react";

/**
 * Wraps navigator.geolocation + OpenStreetMap reverse geocoding.
 * Returns { loading, error, fetchLocation, clearError } where
 * fetchLocation() resolves to { address, city, state, latitude, longitude }.
 */
export default function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = useCallback(() => setError(""), []);

  const fetchLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const message = "Geolocation not supported.";
        setError(message);
        reject(new Error(message));
        return;
      }

      setLoading(true);
      setError("");

      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
              { headers: { "Accept-Language": "en" } },
            );
            const data = await res.json();
            const a = data.address || {};

            const streetParts = [
              a.house_number,
              a.road || a.pedestrian || a.footway,
              a.neighbourhood || a.suburb || a.quarter,
            ].filter(Boolean);
            const localityParts = [
              a.village || a.town || a.city_district,
              a.postcode,
            ].filter(Boolean);

            const address =
              [...streetParts, ...localityParts].join(", ") || data.display_name;
            const city =
              a.city || a.town || a.village || a.county || a.state_district || "";
            const state = a.state || "";

            resolve({
              address,
              city,
              state,
              latitude: latitude.toFixed(6),
              longitude: longitude.toFixed(6),
            });
          } catch {
            const message = "Could not fetch address. Fill manually.";
            setError(message);
            reject(new Error(message));
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setLoading(false);
          const message =
            err.code === 1
              ? "Location access denied. Please allow permission."
              : "Unable to get location. Try again.";
          setError(message);
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  }, []);

  return { loading, error, fetchLocation, clearError };
}