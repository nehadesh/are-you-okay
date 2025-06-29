"use client";
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import ActivityFeed, { AlertFeature, getAlerts } from "./Alert";
import Tooltip from "./Tooltip";
import { FiPlusCircle, FiX, FiMenu } from "react-icons/fi";

// /* =========================
//    PolygonOverlay Component
// ========================= */
// function PolygonOverlay({ paths }: { paths: { lat: number; lng: number }[] }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) return;

//     const polygon = new google.maps.Polygon({
//       paths,
//       strokeColor: "#FF0000",
//       strokeOpacity: 0.8,
//       strokeWeight: 2,
//       fillColor: "#FF0000",
//       fillOpacity: 0.35,
//       geodesic: true,
//     });

//     polygon.setMap(map);

//     return () => {
//       polygon.setMap(null);
//     };
//   }, [map, paths]);

//   return null;
// }

/* =========================
   ActivitySidebar Component
========================= */
function ActivitySidebar({ alerts }: { alerts: AlertFeature[] }) {
  const [isFeedOpen, setIsFeedOpen] = useState(true);

  return (
    <div className="absolute top-4 left-4 z-50 flex flex-col">
      <button
        onClick={() => setIsFeedOpen(!isFeedOpen)}
        className="mb-2 flex items-center justify-center rounded bg-white p-2 shadow-md hover:bg-gray-100"
      >
        {isFeedOpen ? (
          <FiX className="h-5 w-5 text-gray-700" />
        ) : (
          <FiMenu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {isFeedOpen && (
        <div className="w-72 max-h-[80vh] overflow-y-auto rounded bg-white shadow-lg border border-gray-200 dark:border-gray-700">
          <ActivityFeed alerts={alerts}/>
        </div>
      )}
    </div>
  );
}

/* =========================
   AddAlertButton Component
========================= */
function AddAlertButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-50 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
    >
      <FiPlusCircle className="h-6 w-6 text-gray-700" />
    </button>
  );
}

type Alert = {
  id: number;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  zone: string | null;
};


/* =========================
   AddAlertPanel Component
========================= */
function AddAlertPanel({ onClose, setSavedAlerts }: { onClose: () => void; setSavedAlerts: Dispatch<SetStateAction<Alert[]>>}) {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [name, setName] = useState("");

  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autocompleteInstanceRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { Autocomplete } = (await google.maps.importLibrary(
        "places"
      )) as google.maps.PlacesLibrary;

      autocompleteInstanceRef.current = new Autocomplete(
        autocompleteInputRef.current!,
        {
          fields: ["geometry", "formatted_address"],
        }
      );

      autocompleteInstanceRef.current.addListener("place_changed", () => {
        const place = autocompleteInstanceRef.current?.getPlace();
        if (place && place.geometry && place.geometry.location) {
          setSelectedPlace(place);
          console.log("Selected place:", place);
        }
      });
    })();
  }, []);

  return (
    <div
      className="
        fixed top-8 right-4 z-50
        w-full max-w-md
        bg-white shadow-xl border border-gray-200
        rounded-lg
        flex flex-col
        mx-auto
      "
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Add Alert</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
  
        <label className="text-sm font-medium">Address / Location</label>
        <input
          ref={autocompleteInputRef}
          type="text"
          className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          placeholder="Address / Location"
        />
  
        <div className="text-sm text-gray-700">
          {name && (
            <div>
              <strong>Name:</strong> {name}
            </div>
          )}
          {selectedPlace && (
            <div>
              <strong>Address:</strong> {selectedPlace.formatted_address}
            </div>
          )}
        </div>
  
        <button
          onClick={async () => {
            if (selectedPlace?.geometry?.location && name) {
              const lat = selectedPlace.geometry.location.lat();
              const lng = selectedPlace.geometry.location.lng();
              console.log(`Adding alert for coordinates: ${lat}, ${lng}`);
              fetch("")
              setSelectedPlace(null);
              setName("");
              const zone = await getZone({ lat, lng });
              setSavedAlerts((prev) => [...prev, {
                id: Date.now(),
                name,
                address: selectedPlace.formatted_address ?? "",
                coordinates: { lat, lng },
                zone,
              }])
              onClose();
            } else {
              alert("Please select a valid place from suggestions.");
            }
          }}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Alert
        </button>
      </div>
    </div>
  );
  
}

async function getZone(coordinates: { lat: number; lng: number }): Promise<string | null> {
  return await fetch(`https://api.weather.gov/points/${coordinates.lat},${coordinates.lng}`).then(
    (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
  ).then((data: { properties : {forecastZone: string;}}) => {
    const separator = data.properties.forecastZone.lastIndexOf("/") ?? -1;
    if (separator === -1) {
      console.error("Invalid zone format:", data.properties.forecastZone);
      return null;
    }
    const zone = data.properties.forecastZone.substring(separator+1)
    return zone;
  }
  ).catch(err => {console.error("Error fetching zone data:", err); return null;});
}

/* =========================
   DashboardPage Component
========================= */
export default function DashboardPage() {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [isAddAlertOpen, setIsAddAlertOpen] = useState(false);
  const map = useMap();
  const [savedLocations, setSavedLocations] = useState<Alert[]>([]);
  const [savedAlerts, setSavedAlerts] = useState<AlertFeature[]>([]);
  
  // Fetch initial alerts when the component mounts
  useEffect(() => {
    getAlerts().then((alerts) => {
      setSavedAlerts((prev) => ([...prev, ...alerts]));
    });
  }, [])

  // Draw polygons for each saved alert
  useEffect(() => {
    savedAlerts.forEach(alert => {
      const coordinates = alert.geometry?.coordinates[0].map((coord: number[]) => ({
        lat: coord[1],
        lng: coord[0],
      }));

      const strokeColor = alert.properties.severity === "Severe" ? "#FF0000" : "#FFA500";
      const fillColor = alert.properties.severity === "Severe" ? "#FF0000" : "#FFA500";
      if (coordinates) {
        const polygon = new google.maps.Polygon({
          paths: coordinates,
          strokeColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor,
          fillOpacity: 0.35,
          clickable: true,
          
        });
        polygon.setMap(map);
      } 
    })
  }, [savedAlerts, map])

  const locationData = [
    {
      id: 1,
      position: { lat: 47.6101, lng: -122.3344 },
      title: "Seattle, WA",
      content: "This is Seattle.",
    },
    {
      id: 2,
      position: { lat: 34.0522, lng: -118.2437 },
      title: "Los Angeles, CA",
      content: "This is Los Angeles.",
    },
    {
      id: 3,
      position: { lat: 40.7128, lng: -74.006 },
      title: "New York, NY",
      content: "This is New York.",
    },
  ];

  useEffect(() => {
    if (savedLocations.length > 0 && map) {
      const recentAlert = savedLocations[savedLocations.length - 1];
      // Center and zoom the map *once*
      map.panTo(recentAlert.coordinates);
      map.setZoom(15);
      fetch(`https://api.weather.gov/alerts/active/zone/${recentAlert.zone}`).then(
        (resp) => {
          if (!resp.ok) {
            throw new Error("Failed to fetch alerts");
          }
          console.log(JSON.stringify({alertsResponse: resp}, null, 2));
          return resp.json();
        }
      ).catch()
    } 
  }, [savedLocations, map]);

  console.log(JSON.stringify({savedAlerts: savedLocations}, null, 2))

  return (
    <div className="relative h-screen w-full">
      <AddAlertButton onClick={() => setIsAddAlertOpen(true)} />
      <ActivitySidebar alerts={savedAlerts} />
      {isAddAlertOpen && <AddAlertPanel onClose={() => setIsAddAlertOpen(false)} setSavedAlerts={setSavedLocations}/>}

      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {locationData.map((location) => (
          <div key={location.id}>
            <Marker
              position={location.position}
              onClick={() => setActiveMarkerId(location.id)}
            />
            {activeMarkerId === location.id && (
              <Tooltip
                location={location}
                setActiveMarkerId={setActiveMarkerId}
              />
            )}
          </div>
        ))}

        {savedLocations.map((alert) => (
          <div key={alert.id}>
            <Marker
              position={alert.coordinates}
              icon={""} 
              onClick={() => { 
                map?.setCenter(alert.coordinates); 
                map?.setZoom(15); 
              }}
            />
          </div>))}
      </Map>
    </div>
  );
}

function generatePolygonAroundCoordinates(coordinates: { lat: number; lng: number }) {
  const radius = 0.01; // Adjust this value to change the size of the polygon
  return [
    { lat: coordinates.lat + radius, lng: coordinates.lng + radius },
    { lat: coordinates.lat + radius, lng: coordinates.lng - radius },
    { lat: coordinates.lat - radius, lng: coordinates.lng - radius },
    { lat: coordinates.lat - radius, lng: coordinates.lng + radius },
  ];
}
