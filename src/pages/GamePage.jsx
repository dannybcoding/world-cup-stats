import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "./GamePage.css";

function GamePage() {
    const {teamId, countryName, fixtureId} = useParams();
    const [fixture, setFixture] = useState(null);
    const [homePlayers, setHomePlayers] = useState([]);
    const [awayPlayers, setAwayPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
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

        async function fetchGameDetails() {
            if (!fixtureId) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const key = import.meta.env.VITE_API_FOOTBALL_KEY;
                const fixtureResponse = await fetchWithRetry(
                    `https://v3.football.api-sports.io/fixtures?id=${fixtureId}&league=1&season=2022`,
                    {
                        headers: {
                            "x-apisports-key": key,
                        },
                    }
                );

                const fixtureData = await fixtureResponse.json();
                let match = fixtureData.response?.[0];

                if (!match && teamId) {
                    const fallbackResponse = await fetchWithRetry(
                        `https://v3.football.api-sports.io/fixtures?league=1&season=2022&team=${teamId}`,
                        {
                            headers: {
                                "x-apisports-key": key,
                            },
                        }
                    );

                    const fallbackData = await fallbackResponse.json();
                    match = fallbackData.response?.find(
                        (item) => String(item.fixture?.id) === String(fixtureId)
                    );
                }

                if (!match) {
                    throw new Error("Fixture not found");
                }

                setFixture(match);

                const homeId = match.teams?.home?.id;
                const awayId = match.teams?.away?.id;

                const playersResponses = await Promise.all([
                    fetchWithRetry(
                        `https://v3.football.api-sports.io/fixtures/players?fixture=${fixtureId}&team=${homeId}`,
                        {
                            headers: {
                                "x-apisports-key": key,
                            },
                        }
                    ),
                    fetchWithRetry(
                        `https://v3.football.api-sports.io/fixtures/players?fixture=${fixtureId}&team=${awayId}`,
                        {
                            headers: {
                                "x-apisports-key": key,
                            },
                        }
                    ),
                ]);

                const [homePlayersData, awayPlayersData] = await Promise.all(
                    playersResponses.map((response) => response.json())
                );

                setHomePlayers(homePlayersData.response?.[0]?.players ?? []);
                setAwayPlayers(awayPlayersData.response?.[0]?.players ?? []);
            } catch (fetchError) {
                console.error("Game page fetch failed:", fetchError);
                setError(fetchError?.message || String(fetchError));
            } finally {
                setLoading(false);
            }
        }

        fetchGameDetails();
    }, [fixtureId]);

    useEffect(() => {
        if (fixture?.teams) {
            const roundLabel = fixture.league?.round ?? fixture.fixture?.round ?? "Game";
            document.title = `${roundLabel} ${fixture.teams.home.name} vs ${fixture.teams.away.name}`;
        }
    }, [fixture]);

    function playerGoalScorers(players) {
        return players
            .filter((player) => Number(player.statistics?.[0]?.goals?.total || 0) > 0)
            .map((player) => ({
                name: player.player?.name || player.name,
                goals: player.statistics?.[0]?.goals?.total || 0,
            }));
    }

    function playerCardEvents(players) {
        return players
            .filter((player) => {
                const cards = player.statistics?.[0]?.cards;
                return cards && (cards.yellow > 0 || cards.yellowred > 0 || cards.red > 0);
            })
            .map((player) => ({
                name: player.player?.name || player.name,
                yellow: player.statistics?.[0]?.cards?.yellow || 0,
                yellowred: player.statistics?.[0]?.cards?.yellowred || 0,
                red: player.statistics?.[0]?.cards?.red || 0,
            }));
    }

    function playerInjuries(players) {
        return players
            .filter((player) => player.statistics?.[0]?.games?.injured || player.player?.injured)
            .map((player) => player.player?.name || player.name);
    }

    function totalShots(players, type) {
        return players.reduce((sum, player) => {
            const stats = player.statistics?.[0]?.shots;
            return sum + Number(stats?.[type] || 0);
        }, 0);
    }

    function renderTeamBlock(title, players) {
        const goals = playerGoalScorers(players);
        const cards = playerCardEvents(players);
        const injuries = playerInjuries(players);
        const total = totalShots(players, "total");
        const onGoal = totalShots(players, "on");

        return (
            <div className="team-game-block">
                <h3>{title}</h3>
                <div className="game-stats-row">
                    <div>
                        <strong>Shots</strong>
                        <p>{total} total</p>
                        <p>{onGoal} on target</p>
                    </div>
                    <div>
                        <strong>Goals</strong>
                        {goals.length > 0 ? (
                            <ul>
                                {goals.map((scorer) => (
                                    <li key={scorer.name}>
                                        {scorer.name}: {scorer.goals}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No goal scorers recorded</p>
                        )}
                    </div>
                </div>
                <div className="game-stats-row">
                    <div>
                        <strong>Cards</strong>
                        {cards.length > 0 ? (
                            <ul>
                                {cards.map((card) => (
                                    <li key={card.name}>
                                        {card.name}: {card.yellow} yellow, {card.red} red{card.yellowred ? `, ${card.yellowred} second yellow` : ""}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No cards recorded</p>
                        )}
                    </div>
                    <div>
                        <strong>Injuries</strong>
                        {injuries.length > 0 ? (
                            <ul>
                                {injuries.map((playerName) => (
                                    <li key={playerName}>{playerName}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No injuries reported</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const roundLabel = fixture?.league?.round ?? fixture?.fixture?.round ?? "Game";
    const homeName = fixture?.teams?.home?.name ?? "Home";
    const awayName = fixture?.teams?.away?.name ?? "Away";
    const matchScore = `${fixture?.goals?.home ?? "-"} - ${fixture?.goals?.away ?? "-"}`;
    const matchDate = fixture?.fixture?.date
        ? new Date(fixture.fixture.date).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "TBD";
    const matchStatus = fixture?.fixture?.status?.long ?? "Scheduled";
    const venueName = fixture?.fixture?.venue?.name;
    const venueCity = fixture?.fixture?.venue?.city;

    return (
        <div className="game-page">
            <Navbar />

            <div className="game-header">
                <Link className="back-link" to={`/teams/${teamId}/${countryName}`}>
                    ← Back to team
                </Link>
                {fixture && (
                    <h1 className="page-header">
                        {roundLabel} {homeName} vs {awayName}
                    </h1>
                )}
            </div>

            {loading && <p className="empty-state">Loading match details…</p>}

            {error && (
                <div className="error-banner" role="alert">
                    <p>Unable to load match details.</p>
                    <pre>{error}</pre>
                </div>
            )}

            {fixture && (
                <main className="game-details-container">
                    <section className="game-overview">
                        <div className="game-overview-card">
                            <h2>Match overview</h2>
                            <p><strong>Status:</strong> {matchStatus}</p>
                            <p><strong>Date:</strong> {matchDate}</p>
                            <p><strong>Venue:</strong> {venueName}{venueCity ? `, ${venueCity}` : ""}</p>
                            <p><strong>Score:</strong> {matchScore}</p>
                        </div>
                    </section>

                    <section className="game-team-stats">
                        {renderTeamBlock(homeName, homePlayers)}
                        {renderTeamBlock(awayName, awayPlayers)}
                    </section>
                </main>
            )}

            <Footer />
        </div>
    );
}

export default GamePage;
