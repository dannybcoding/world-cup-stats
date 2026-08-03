import {Routes, Route} from "react-router-dom";

import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import Player from "./pages/Player.jsx";
import TournamentHistory from "./pages/TournamentHistory";
import Stats from "./pages/Stats.jsx";
import TeamPage from "./components/TeamPage.jsx";
import GamePage from "./pages/GamePage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/teams" element={<Teams/>}/>
            <Route path="/players" element={<Players/>}/>
            <Route path="/players/:playerId" element={<Player/>}/>
            <Route path="/stats" element={<Stats/>}/>
            <Route path="/tournaments" element={<TournamentHistory/>}/>
            <Route path="/teams/:teamId/:countryName/games/:fixtureId" element={<GamePage/>}/>
            <Route path="/teams/:teamId/:countryName" element={<TeamPage/>}/>
        </Routes>
    );
}

export default App;