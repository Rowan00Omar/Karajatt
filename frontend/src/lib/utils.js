import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function extractAddressComponents(place, fallbackCity = "Riyadh", fallbackCountry = "SA") {
  // if (!place) return {};

  // const components = place?.address_components || [];

  // const find = (type) => components.find((c) => c.types.includes(type))?.long_name || "";

  // let streetNumber = find("street_number");
  // let route = find("route");

  // let street = route;
  // if (streetNumber && !route.includes(streetNumber)) {
  //   street = `${streetNumber} ${route}`.trim();
  // }


  // return {
  //   lat: place.geometry?.location?.lat() || null,
  //   lng: place.geometry?.location?.lng() || null,
  //   building: "",

  //   street: street,
  //   postal_code: find("postal_code") || "",
  //   city: fallbackCity,
  //   state: fallbackCity,
  //   country: fallbackCountry,
  // };

  const comp = place.address_components || [];
  console.log('place', place)
  return {
    lat: place.geometry?.location?.lat() || null,
    lng: place.geometry?.location?.lng() || null,
    street: comp.find((c) => c.types.includes("route"))?.long_name || "",
    building: "",
    postal_code: comp.find((c) => c.types.includes("postal_code"))?.long_name || "",
    city: fallbackCity,
    state: fallbackCity,
    country: fallbackCountry,
  };

}
