import { useEffect } from "react";
import { useMap } from "react-leaflet";

// eslint-disable-next-line react/prop-types
export default function MapComponent({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], map.getZoom());
    }
  }, [latitude, longitude, map]);

  return null;
}
