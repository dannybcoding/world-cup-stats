import {Routes, Route} from "react-router-dom";

import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import TournamentHistory from "./pages/TournamentHistory";
import Stats from "./pages/Stats.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/teams" element={<Teams/>}/>
            <Route path="/players" element={<Players/>}/>
            <Route path="/stats" element={<Stats/>}/>
            <Route path="/tournaments" element={<TournamentHistory/>}/>
        </Routes>
    );
}

export default App;