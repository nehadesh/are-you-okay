"use client"
import { Map, Marker, useMarkerRef,  useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export function PolygonOverlay({paths}:{ paths: {
  lat: number;
  lng: number;
}[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const polygon = new google.maps.Polygon({
      paths: paths,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      geodesic: true
    });

    polygon.setMap(map);

    return () => {
      polygon.setMap(null);
    };
  }, [map, paths]);

  return null; // no JSX rendered
}



export default function DashboardPage() {
  // const [markerRef, marker] = useMarkerRef();
  const center = { lat: 53.54992, lng: 10.00678 };

  const paths = [
    { lat: center.lat + 0.0045, lng: center.lng + 0.0075 },
    { lat: center.lat + 0.0045, lng: center.lng - 0.0075 },
    { lat: center.lat - 0.0045, lng: center.lng - 0.0075 },
    { lat: center.lat - 0.0045, lng: center.lng + 0.0075 }
  ];
  return (
    <>
    <Map
      style={{width: '100vw', height: '100vh'}}
      defaultCenter={{lat: 22.54992, lng: 0}}
      defaultZoom={3}
      zoom={12}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      center={{lat: 53.54992, lng: 10.00678}}
    >
        <PolygonOverlay paths={paths}/>
    </Map>

  </>
  );
}
