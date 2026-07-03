import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import TournamentHistory from "./pages/TournamentHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/players" element={<Players />} />
      <Route path="/tournaments" element={<TournamentHistory />} />
    </Routes>
  );
}

export default App;