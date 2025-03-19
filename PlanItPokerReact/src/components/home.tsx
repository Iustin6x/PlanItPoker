import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [roomId, setRoomId] = useState<string>(""); // ID-ul camerei introdus de utilizator
  const [username, setUsername] = useState<string>(""); // Numele utilizatorului
  const navigate = useNavigate();

  // Funcție pentru crearea unei camere noi
  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substr(2, 6); // Generează un ID aleatoriu
    navigate(`/room/${newRoomId}`);
  };

  // Funcție pentru alăturarea la o cameră existentă
  const joinRoom = () => {
    if (roomId && username) {
      navigate(`/room/${roomId}?user=${username}`);
    }
  };

  return (
    <div className="home-container">
      <h1>Plan It Poker</h1>
      <button onClick={createRoom}>Crează Cameră</button>
      <form onSubmit={(e) => { e.preventDefault(); joinRoom(); }}>
        <input 
          type="text" 
          value={roomId} 
          onChange={(e) => setRoomId(e.target.value)} 
          placeholder="ID Cameră" 
          required 
        />
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Nume" 
          required 
        />
        <button type="submit">Intră în Cameră</button>
      </form>
    </div>
  );
};

export default Home;
