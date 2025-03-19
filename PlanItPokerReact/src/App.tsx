import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import Home from "./components/home";
import Room from "./components/room";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} /> {/* Ruta pentru cameră */}
      </Routes>
    </Router>
  );
};

export default App
