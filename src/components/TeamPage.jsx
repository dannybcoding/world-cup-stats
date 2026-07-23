import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./TeamPage.css";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";


function TeamPage() {

    const {teamId, countryName} = useParams();

    const [players, setPlayers] = useState([]);
    const [team, setTeam] = useState(null);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {

        async function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function fetchWithRetry(url, options, retries = 3, retryDelay = 1500) {
            for (let attempt = 0; attempt <= retries; attempt++) {
                try {
                    const response = await fetch(url, options);

                    if (response.ok) {
                        return response;
                    }

                    const retryableStatus = [429, 500, 502, 503, 504];
                    const shouldRetry = retryableStatus.includes(response.status);

                    const text = await response.text();
                    const message = `Request failed: ${response.status} ${response.statusText} ${text}`;

                    if (attempt < retries && shouldRetry) {
                        console.warn(`Retrying request (${attempt + 1}/${retries}) after ${retryDelay}ms: ${url}`);
                        await sleep(retryDelay);
                        continue;
                    }

                    throw new Error(message);
                } catch (error) {
                    if (attempt < retries && (error instanceof TypeError || error.message.includes("Failed to fetch"))) {
                        console.warn(`Network error, retrying (${attempt + 1}/${retries}) after ${retryDelay}ms: ${error.message}`);
                        await sleep(retryDelay);
                        continue;
                    }

                    throw error;
                }
            }
        }

        async function fetchTeam() {
            try {
                const key = import.meta.env.VITE_API_FOOTBALL_KEY;

                // Get team ID
                const teamResponse = await fetchWithRetry(
                    `https://v3.football.api-sports.io/teams?id=${teamId}`,
                    {
                        headers: {
                            "x-apisports-key": key
                        }
                    }
                );

                const teamData = await teamResponse.json();
                console.log("Team response:", teamData);

                if (!teamData.response?.[0]?.team) {
                    throw new Error("Team data is missing from response");
                }

                const teamInfo = teamData.response[0].team;
                setTeam(teamInfo);

                // Get roster
                const squadResponse = await fetchWithRetry(
                    `https://v3.football.api-sports.io/players/squads?team=${teamId}`,
                    {
                        headers: {
                            "x-apisports-key": key
                        }
                    }
                );

                const squadData = await squadResponse.json();
                console.log("Squad response:", squadData);

                if (!squadData.response?.[0]?.players) {
                    throw new Error("Squad data is missing from response");
                }

                setPlayers(
                    squadData.response[0].players
                );

                const statsResponse = await fetchWithRetry(
                    `https://v3.football.api-sports.io/teams/statistics?league=1&season=2022&team=${teamId}`,
                    {
                        headers: {
                            "x-apisports-key": key
                        }
                    }
                );

                const statsData = await statsResponse.json();
                console.log("Stats response:", statsData);

                if (!statsData.response) {
                    throw new Error("Stats data is missing from response");
                }

                setStats(statsData.response);
                setError(null);
            } catch (fetchError) {
                console.error("Team page fetch failed:", fetchError);
                setError(fetchError?.message || String(fetchError));
            }
        }


        fetchTeam();


    }, [countryName]);


    return (

        <div className="team-page">
            <Navbar/>
            {error && (
                <div className="error-banner" role="alert">
                    <p>Unable to load team data.</p>
                    <pre>{error}</pre>
                </div>
            )}
            {team && (
                <>
                    <img
                        src={team.logo}
                        alt={team.name}
                    />

                    <h1>{team.name}</h1>
                </>
            )}
            {stats && (
                <section className="team-stats">

                    <h2>Team Statistics</h2>

                    <div className="stats-grid">

                        <div className="stat-card">
                            <span className="stat-label">🏟️ Matches</span>
                            <span className="stat-value">
                    {stats.fixtures.played.total}
                </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">📊 Record</span>
                            <span className="stat-value">
                    {stats.fixtures.wins.total}W-
                                {stats.fixtures.draws.total}D-
                                {stats.fixtures.loses.total}L
                </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">📈 Form</span>

                            <div className="form-badges">
                                {stats.form.split("").map((result, index) => (
                                    <span
                                        key={index}
                                        className={`form-badge ${
                                            result === "W"
                                                ? "win"
                                                : result === "D"
                                                    ? "draw"
                                                    : "loss"
                                        }`}
                                    >
                {result}
            </span>
                                ))}
                            </div>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">⚽ Goals For</span>
                            <span className="stat-value">
                    {stats.goals.for.total.total}
                </span>
                            <span className="stat-subtitle">
                    {stats.goals.for.average.total}/match
                </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">🛡️ Goals Against</span>
                            <span className="stat-value">
                    {stats.goals.against.total.total}
                </span>
                            <span className="stat-subtitle">
                    {stats.goals.against.average.total}/match
                </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">➕ Goal Difference</span>
                            <span className="stat-value">
                    {stats.goals.for.total.total - stats.goals.against.total.total > 0
                        ? "+"
                        : ""}
                                {stats.goals.for.total.total - stats.goals.against.total.total}
                </span>
                        </div>

                        <div className="stat-card">
                           <span className="stat-label">🧤 Clean Sheets</span>
                            <span className="stat-value">
                    {stats.clean_sheet.total}
                </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">🚫 Failed to Score</span>
                            <span className="stat-value">
                    {stats.failed_to_score.total}
                </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">🎯 Penalties</span>
                            <span className="stat-value">
                    {stats.penalty.scored.total}/{stats.penalty.total}
                </span>
                            <span className="stat-subtitle">
                    {stats.penalty.scored.percentage}
                </span>
                        </div>

                    </div>

                </section>
            )}


            <div className="roster">

                {players.map(player => (

                    <div
                        className="player-card"
                        key={player.id}
                    >

                        <img
                            src={
                                player.photo ||
                                "/player-placeholder.png"
                            }
                            alt={player.name}
                        />


                        <h3>{player.name}</h3>

                        <p>
                            {player.position}
                        </p>


                        <p>
                            #{player.number ?? "N/A"}
                        </p>

                    </div>

                ))}

            </div>
            <Footer/>
        </div>

    );
}


export default TeamPage;