import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

type Coords = {
  lat: number;
  lng: number;
  timestamp: number;
};

const socket: Socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
  autoConnect: true,
});

export default function LocationDebug() {
  const [currentPos, setCurrentPos] = useState<GeolocationCoordinates | null>(null);
  const [myHistory, setMyHistory] = useState<Coords[]>([]);
  const [allUsers, setAllUsers] = useState<Record<string, Coords>>({});

  useEffect(() => {
    // 연결 및 데이터 수신 리스너 등록
    socket.on("connect", () => console.log("Connected:", socket.id));
    
    socket.on("location_history", (data) => {
      setMyHistory(data.history);
    });

    socket.on("all_last_locations", (data) => {
      setAllUsers(data);
    });

    return () => {
      socket.off("connect");
      socket.off("location_history");
      socket.off("all_last_locations");
    };
  }, []);

  // 1. 현재 위치 전송
  const sendLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      
      setCurrentPos(pos.coords);
      socket.emit("sendLocation", { 
        lat: latitude, 
        lng: longitude, 
        timestamp: Date.now() 
      });
    });
  };

  // 2. 내 이동 경로 요청
  const fetchHistory = () => {
    socket.emit("getHistory");
  };

  // 3. 전체 유저 위치 요청
  const fetchAllUsers = () => {
    socket.emit("getAllLastLocations");
  };

  return (
    <div>
      <h2>GPS Socket Tester</h2>
      
      {/* 컨트롤 버튼 영역 */}
      <div>
        <button onClick={sendLocation}>Send GPS</button>
        <button onClick={fetchHistory}>Get History</button>
        <button onClick={fetchAllUsers}>Get All Users</button>
      </div>

      <hr />

      {/* 1. 현재 전송 상태 */}
      <section>
        <h3>Last Sent Location</h3>
        {currentPos ? (
          <div>Lat: {currentPos.latitude}, Lng: {currentPos.longitude}</div>
        ) : (
          <div>No data sent yet</div>
        )}
      </section>

      <hr />

      {/* 2. 내 이동 경로 리스트 */}
      <section>
        <h3>My Location History ({myHistory.length})</h3>
        <ul>
          {myHistory.map((item, idx) => (
            <li key={idx}>
              [{new Date(item.timestamp).toLocaleTimeString()}] {item.lat}, {item.lng}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* 3. 접속한 모든 유저의 마지막 위치 */}
      <section>
        <h3>All Users Last Position</h3>
        <ul>
          {Object.entries(allUsers).map(([id, pos]) => (
            <li key={id}>
              <b>{id}</b>: {pos.lat}, {pos.lng}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
