"use client"
import { Map, Marker, useMarkerRef, useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import ActivityFeed from "./Alert";
import Tooltip from "./Tooltip";

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

  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

  const locationData = [
  {
    id: 1,
    position: { lat: 47.6101, lng: -122.3344 },
    title: 'Seattle, WA',
    content: 'This is Seattle.',
  },
  {
    id: 2,
    position: { lat: 34.0522, lng: -118.2437 },
    title: 'Los Angeles, CA',
    content: 'This is Los Angeles.',
  },
  {
    id: 3,
    position: { lat: 40.7128, lng: -74.006 },
    title: 'New York, NY',
    content: 'This is New York.',
  },
];

  const weatherData = {
  "lat": 64.2008,
  "lon": -149.4937,
  "timezone": "America/Anchorage",
  "timezone_offset": -28800,
  "current": {
    "dt": 1751162279,
    "sunrise": 1751110232,
    "sunset": 1751185914,
    "temp": 290.85,
    "feels_like": 290.03,
    "pressure": 1009,
    "humidity": 52,
    "dew_point": 280.88,
    "uvi": 0.75,
    "clouds": 100,
    "visibility": 10000,
    "wind_speed": 2.03,
    "wind_deg": 263,
    "wind_gust": 4.96,
    "weather": [
      {
        "id": 804,
        "main": "Clouds",
        "description": "overcast clouds",
        "icon": "04d"
      }
    ]
  },
  "alerts": [
    {
      "sender_name": "NWS Philadelphia - Mount Holly (New Jersey, Delaware, Southeastern Pennsylvania)",
      "event": "Small Craft Advisory",
      "start": 1684952747,
      "end": 1684988747,
      "description": "...SMALL CRAFT ADVISORY REMAINS IN EFFECT FROM 5 PM THIS\nAFTERNOON TO 3 AM EST FRIDAY...\n* WHAT...North winds 15 to 20 kt with gusts up to 25 kt and seas\n3 to 5 ft expected.\n* WHERE...Coastal waters from Little Egg Inlet to Great Egg\nInlet NJ out 20 nm, Coastal waters from Great Egg Inlet to\nCape May NJ out 20 nm and Coastal waters from Manasquan Inlet\nto Little Egg Inlet NJ out 20 nm.\n* WHEN...From 5 PM this afternoon to 3 AM EST Friday.\n* IMPACTS...Conditions will be hazardous to small craft.",
      "tags": []
    }
  ]
};



  const center = { lat: 47.6101, lng: -122.3344 };

  const paths = [
    { lat: center.lat + 0.0045, lng: center.lng + 0.0075 },
    { lat: center.lat + 0.0045, lng: center.lng - 0.0075 },
    { lat: center.lat - 0.0045, lng: center.lng - 0.0075 },
    { lat: center.lat - 0.0045, lng: center.lng + 0.0075 }
  ];

  return (
  <div className="flex h-screen">
    {/* Sidebar (ActivityFeed) */}
    <div className="w-full max-w-xs overflow-y-auto border-r border-gray-200 dark:border-gray-700">
      <ActivityFeed />
    </div>

    {/* Main content (Map) */}
    <div className="flex-1">
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <PolygonOverlay paths={paths} />
        {locationData.map((location) => (
        <div key={location.id}>
          <Marker
            position={location.position}
            onClick={() => setActiveMarkerId(location.id)}
          />
          {activeMarkerId === location.id && (
            <Tooltip location={location} setActiveMarkerId={setActiveMarkerId} />
          )}
        </div>
      ))}
      </Map>
    </div>
  </div>
);
}
