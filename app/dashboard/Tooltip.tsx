import { InfoWindow } from "@vis.gl/react-google-maps";

interface TooltipProps {
  location: {
    position: google.maps.LatLngLiteral;
  };
  setActiveMarkerId: (id: number | null) => void;
}

export default function Tooltip({ location, setActiveMarkerId }: TooltipProps) {
  return (
    <InfoWindow position={location.position} onCloseClick={() => setActiveMarkerId(null)}>
          <div className="space-y-1 mx-5 mb-5">
            <h3 className="font-semibold mb-5 text-gray-900 dark:text-black">{location.title}</h3>
            <p className="dark:text-black">
              Italy is located in the middle of the Mediterranean Sea, in Southern Europe. It is also considered part of Western Europe. A unitary parliamentary republic with Rome as its capital and largest city.
            </p>
          </div>
    </InfoWindow>
  );
}
