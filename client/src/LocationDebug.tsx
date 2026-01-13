import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("ws://localhost:3000", {
  transports: ["websocket"],
  autoConnect: true,
});

export default function LocationDebug() {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  const sendLocation = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    
    setCoords(pos.coords);
    
    socket.emit("send_location", {
      lat: latitude,
      lng: longitude,
      timestamp: Date.now()
    });
  };

  const getLocation = () => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      sendLocation,
      (err) => console.error(err)
    );
  };

  return (
    <div>
      <button onClick={getLocation}>Send GPS</button>
      {coords && (
        <div>
          Coordinates sent: {coords.latitude}, {coords.longitude}
        </div>
      )}
    </div>
  );
}
