"use client";
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import ActivityFeed, { AlertFeature, getAlerts } from "./Alert";
import { FiPlusCircle, FiX, FiMenu, FiMessageSquare } from "react-icons/fi";

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
          <FiX className="h-5 w-5 text-black" />
        ) : (
          <FiMenu className="h-5 w-5 text-black" />
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
      <FiPlusCircle className="h-6 w-6 text-black" />
    </button>
  );
}

function AddAlertPanelBottom({
  onClose,
}: {
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from API:", response.status, errorText);
      throw new Error("API request failed");
    }

    const data = await response.json();

    const botMessage = { sender: "bot", text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="fixed bottom-8 right-4 z-50 w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-black">Chat Assistant</h2>
        <button onClick={onClose} className="text-black hover:text-black">
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-h-[300px] text-sm space-y-2 text-black">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md ${
              msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded p-2 focus:outline-none text-black"
          placeholder="Ask something..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function OpenBottomPanelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 right-4 z-50 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
    >
      <FiMessageSquare className="h-6 w-6 text-black" />
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
        <h2 className="text-lg font-semibold">Drop Pin</h2>
        <button
          onClick={onClose}
          className="text-black hover:text-black"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[80vh] text-black">
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
  
        <div className="text-sm">
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
          className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700"
        >
          Add Watch Location
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
  const [isAddAlertOpen, setIsAddAlertOpen] = useState(false);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
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
        <OpenBottomPanelButton onClick={() => setIsBottomPanelOpen(true)} />
      <ActivitySidebar alerts={savedAlerts} />
      {isAddAlertOpen && <AddAlertPanel onClose={() => setIsAddAlertOpen(false)} setSavedAlerts={setSavedLocations}/>}
        {isBottomPanelOpen && (
  <AddAlertPanelBottom
    onClose={() => setIsBottomPanelOpen(false)}
    setSavedAlerts={setSavedLocations}
  />
)}

      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >

        {savedLocations.map((alert) => (
          <div key={alert.id}>
            <Marker
              position={alert.coordinates}
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
