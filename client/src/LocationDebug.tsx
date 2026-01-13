import { useState } from "react";

export default function LocationDebug() {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords(pos.coords),
      (err) => console.error(err)
    );
  };

  return (
    <div>
      <button onClick={getLocation}>Get GPS</button>
      {coords && (
        <div>
          latitude: {coords.latitude} <br />
          longitude: {coords.longitude}
        </div>
      )}
    </div>
  );
}
