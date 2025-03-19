import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

interface RoomProps {
  id: string;
}

const Room: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ID-ul camerei din URL
  const query = new URLSearchParams(window.location.search);
  const username = query.get("user") || "Anonim"; // Numele utilizatorului din query string
  const [users, setUsers] = useState<string[]>([]); // Lista de utilizatori din cameră

  // Simulăm adăugarea unui utilizator într-o cameră
  useEffect(() => {
    const addUserToRoom = () => {
      setUsers((prevUsers) => [...prevUsers, username]);
    };

    addUserToRoom(); // Adăugăm utilizatorul la listă
  }, [username]);

  return (
    <div className="room-container">
      <h2>Cameră: {id}</h2>
      <p>Utilizator: {username}</p>

      <h3>Utilizatori în Cameră:</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>

      {/* Aici poți adăuga funcționalități pentru poker */}
    </div>
  );
};

export default Room;
