import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "./Player.css";

function Player() {
    const {playerId} = useParams();
    const [player, setPlayer] = useState(null);
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPlayer() {
            if (!playerId) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `https://v3.football.api-sports.io/players?id=${playerId}&league=1&season=2022`,
                    {
                        headers: {
                            "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to load player: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                const playerData = data.response?.[0]?.player;
                const statsData = data.response?.[0]?.statistics ?? [];

                if (!playerData) {
                    throw new Error("Player data not found");
                }

                setPlayer(playerData);
                setStatistics(statsData);
            } catch (fetchError) {
                setError(fetchError?.message || String(fetchError));
            } finally {
                setLoading(false);
            }
        }

        fetchPlayer();
    }, [playerId]);

    return (
        <div className="player-page">
            <Navbar />

            <div className="player-page-header">
                <Link className="back-link" to="/players">
                    ← Back to players
                </Link>
            </div>

            {loading && <p className="empty-state">Loading player details…</p>}

            {error && (
                <div className="error-banner" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {player && (
                <main className="player-details-container">
                    <section className="player-summary-card">
                        <img
                            className="player-photo"
                            src={player.photo || "/player-placeholder.png"}
                            alt={player.name}
                        />

                        <div className="player-summary">
                            <h1 className="page-header">{player.name}</h1>
                            <p><strong>Nationality:</strong> {player.nationality}</p>
                            <p><strong>Age:</strong> {player.age}</p>
                            <p><strong>Height:</strong> {player.height || "N/A"} cm</p>
                            <p><strong>Weight:</strong> {player.weight || "N/A"} kg</p>
                            <p><strong>Position:</strong> {player.position || "N/A"}</p>
                            <p><strong>Injured:</strong> {player.injured ? "Yes" : "No"}</p>
                            <p><strong>Birth:</strong> {player.birth?.date || "N/A"} in {player.birth?.place || "Unknown"}</p>
                        </div>
                    </section>

                    {statistics.length > 0 && (
                        <section className="player-stats-card">
                            <h2 className="section-header">Statistics</h2>
                            {statistics.map((stat, index) => (
                                <div className="player-stat-block" key={index}>
                                    <h3>{stat.team?.name || "Team data"}</h3>
                                    <div className="stat-grid">
                                        <div><strong>League:</strong> {stat.league?.name}</div>
                                        <div><strong>Appearances:</strong> {stat.games?.appearences ?? "N/A"}</div>
                                        <div><strong>Lineups:</strong> {stat.games?.lineups ?? "N/A"}</div>
                                        <div><strong>Minutes:</strong> {stat.games?.minutes ?? "N/A"}</div>
                                        <div><strong>Rating:</strong> {stat.games?.rating ?? "N/A"}</div>
                                        <div><strong>Goals:</strong> {stat.goals?.total ?? "N/A"}</div>
                                        <div><strong>Assists:</strong> {stat.goals?.assists ?? "N/A"}</div>
                                        <div><strong>Shots Total:</strong> {stat.shots?.total ?? "N/A"}</div>
                                        <div><strong>Passes:</strong> {stat.passes?.total ?? "N/A"}</div>
                                        <div><strong>Pass Accuracy:</strong> {stat.passes?.accuracy ?? "N/A"}%</div>
                                        <div><strong>Tackles:</strong> {stat.tackles?.total ?? "N/A"}</div>
                                        <div><strong>Duels Won:</strong> {stat.duels?.won ?? "N/A"}</div>
                                        <div><strong>Cards:</strong> {stat.cards?.yellow ?? 0} yellow, {stat.cards?.red ?? 0} red</div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}
                </main>
            )}

            <Footer />
        </div>
    );
}

export default Player;
