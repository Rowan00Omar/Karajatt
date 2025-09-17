import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import googleMapsConfig from "../config/googleMaps";
import { extractAddressComponents } from "../lib/utils";

const containerStyle = {
  width: "100%",
  height: "250px",
};

function DeliveryMap({ mode, deliveryData, setDeliveryData }) {
  const [marker, setMarker] = useState(googleMapsConfig.ourLocation);
  const [autocomplete, setAutocomplete] = useState(null);

  // Update marker if deliveryData changes (useful when page loads)
  useEffect(() => {
    // If deliveryData already has lat/lng, use it
    if (deliveryData.lat && deliveryData.lng) {
      setMarker({ lat: deliveryData.lat, lng: deliveryData.lng });

      // Only prefill missing fields if they are empty
      if (
        !deliveryData.street ||
        !deliveryData.postal_code ||
        !deliveryData.building
      ) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: deliveryData.lat, lng: deliveryData.lng } },
          (results, status) => {
            if (status === "OK" && results[0]) {
              const enriched = extractAddressComponents(results[0]);
              setDeliveryData((prev) => ({ ...prev, ...enriched }));
            } else {
              // fallback: just fill lat/lng and empty strings
              setDeliveryData((prev) => ({
                ...prev,
                lat: deliveryData.lat,
                lng: deliveryData.lng,
                street: prev.street || "",
                building: prev.building || "",
                postal_code: prev.postal_code || "",
                
              }));
            }
          }
        );
      }
      return;
    }

    // If no deliveryData yet, set to default (ourLocation)
    const loc = googleMapsConfig.ourLocation;
    setMarker(loc);
    setDeliveryData((prev) => ({
      ...prev,
      lat: loc.lat,
      lng: loc.lng,
      street: prev.street || "",
      building: prev.building || "",
      postal_code: prev.postal_code || "",
    
    }));
  }, []);

  // Search box on load
  const onLoad = (auto) => setAutocomplete(auto);

  // Handle search result
  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    const loc = extractAddressComponents(place);
    setMarker({ lat: loc.lat, lng: loc.lng });
    setDeliveryData((prev) => ({ ...prev, ...loc }));
  };

  // Handle manual map click
  const handleClick = async (event) => {
    if (mode !== "your") return;

    const loc = { lat: event.latLng.lat(), lng: event.latLng.lng() };

    // Reverse geocode using Google Maps
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: loc }, (results, status) => {
      let enriched = {};
      if (status === "OK" && results[0]) {
        enriched = extractAddressComponents(results[0]);
      } else {
        enriched = loc; // fallback if geocode fails
      }

      setMarker({ lat: enriched.lat || loc.lat, lng: enriched.lng || loc.lng });
      setDeliveryData((prev) => ({ ...prev, ...enriched }));
    });
  };

  // Use current browser location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation || mode !== "your") return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: loc }, (results, status) => {
        let enriched = {};
          enriched = extractAddressComponents(results[0]);
       
        console.log(enriched)
        setMarker({
          lat: enriched.lat || loc.lat,
          lng: enriched.lng || loc.lng,
        });
        setDeliveryData((prev) => ({ ...prev, ...enriched }));
      });
    });
  };

  return (
    <div className="space-y-2">
      <LoadScript
        googleMapsApiKey={googleMapsConfig.apiKey}
        libraries={googleMapsConfig.libraries}
      >
        {/* Only show search + current location if user mode */}
        {mode === "your" && (
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="ابحث عن موقعك"
              className="w-full p-2 border rounded"
            />
          </Autocomplete>
        )}

        {/* Map */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mode === "your" ? marker : googleMapsConfig.ourLocation}
          zoom={13}
          onClick={handleClick}
          options={{
            draggable: mode === "your",
            disableDefaultUI: false,
            fullscreenControl: true,
          }}
          onLoad={(map) => {
            const targetButton = document.getElementById("currentLocation");
            if (mode === "your") {
              if (!targetButton) {
                const locationButton = document.createElement("button");
                locationButton.textContent = "📍";
                locationButton.setAttribute("id", "currentLocation");
                locationButton.classList.add(
                  "bg-white",
                  "border",
                  "rounded-full",
                  "p-2",
                  "shadow",
                  "m-2",
                  "w-10",
                  "h-10",
                  "cursor-pointer"
                );
                locationButton.addEventListener("click", (event) => {
                  event.preventDefault();
                  handleCurrentLocation();
             
                });
                // Add button to map (bottom right)
                map.controls[
                  window.google.maps.ControlPosition.RIGHT_BOTTOM
                ].push(locationButton);
              }
            } else {
              if (targetButton) {
                document.removeChild(targetButton);
              }
            }
          }}
        >
          <Marker
            position={mode === "your" ? marker : googleMapsConfig.ourLocation}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default DeliveryMap;
