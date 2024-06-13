import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// eslint-disable-next-line react/prop-types
const SearchControl = ({ setLatitude, setLongitude, setAddress }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
      showMarker: true,
      showPopup: false,
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      maxMarkers: 1,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: "Enter address, please",
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x, y, label } = result.location;
      setLatitude(y);
      setLongitude(x);
      setAddress(label); // Ensure setAddress is called
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, setLatitude, setLongitude, setAddress]);

  return null;
};

export default SearchControl;
