import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "./Players.css";

function Players() {
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [selectedTeamName, setSelectedTeamName] = useState("");
    const [players, setPlayers] = useState([]);
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTeams() {
            try {
                const cached = localStorage.getItem("countries");
                const timestamp = Number(localStorage.getItem("countriesTimestamp"));
                const oneDay = 24 * 60 * 60 * 1000;
                const parsed = cached ? JSON.parse(cached) : [];

                if (parsed.length > 0 && timestamp && Date.now() - timestamp < oneDay) {
                    setTeams(parsed);
                    setLoadingTeams(false);
                    return;
                }

                const response = await fetch(
                    "https://v3.football.api-sports.io/teams?league=1&season=2022",
                    {
                        headers: {
                            "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                const teamsList = data.response.map((item) => item.team);
                teamsList.sort((a, b) => a.name.localeCompare(b.name));

                setTeams(teamsList);
                localStorage.setItem("countries", JSON.stringify(teamsList));
                localStorage.setItem("countriesTimestamp", Date.now());
            } catch (fetchError) {
                setError(fetchError?.message || String(fetchError));
            } finally {
                setLoadingTeams(false);
            }
        }

        fetchTeams();
    }, []);

    useEffect(() => {
        if (!selectedTeamId) {
            setPlayers([]);
            return;
        }

        async function fetchPlayers() {
            setLoadingPlayers(true);
            setError(null);

            try {
                const response = await fetch(
                    `https://v3.football.api-sports.io/players/squads?team=${selectedTeamId}`,
                    {
                        headers: {
                            "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch players: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                const roster = data.response?.[0]?.players ?? [];

                setPlayers(roster);
            } catch (fetchError) {
                setError(fetchError?.message || String(fetchError));
            } finally {
                setLoadingPlayers(false);
            }
        }

        fetchPlayers();
    }, [selectedTeamId]);

    function handleTeamChange(event) {
        const value = event.target.value;
        setSelectedTeamId(value);

        const selectedTeam = teams.find((team) => String(team.id) === value);
        setSelectedTeamName(selectedTeam?.name ?? "");
    }

    return (
        <div className="players-page">
            <Navbar />

            <h1 className="page-header">Players</h1>

            <section className="team-select-container">
                <label htmlFor="team-select" className="team-select-label">
                    Select a team to view its players
                </label>

                <select
                    id="team-select"
                    className="team-select"
                    value={selectedTeamId}
                    onChange={handleTeamChange}
                    disabled={loadingTeams}
                >
                    <option value="">Choose a team...</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>

                {loadingTeams && <p className="empty-state">Loading teams…</p>}
            </section>

            {error && (
                <div className="error-banner" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {selectedTeamId && !loadingPlayers && players.length === 0 && (
                <p className="empty-state">No players found for {selectedTeamName}.</p>
            )}

            {loadingPlayers && (
                <p className="empty-state">Loading players for {selectedTeamName}…</p>
            )}

            {players.length > 0 && (
                <section>
                    <h2 className="section-header">Players for {selectedTeamName}</h2>
                    <div className="player-grid">
                        {players.map((player) => (
                            <Link
                                className="player-card-link"
                                to={`/players/${player.id}`}
                                key={player.id}
                                aria-label={`View details for ${player.name}`}
                            >
                                <article className="player-card">
                                    <img
                                        src={player.photo || "/player-placeholder.png"}
                                        alt={player.name}
                                    />
                                    <h3 className="player-name">{player.name}</h3>
                                    <p className="player-position">
                                        {player.position || "Position unavailable"}
                                    </p>
                                    <p className="player-number">
                                        #{player.number ?? "N/A"}
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}

export default Players;