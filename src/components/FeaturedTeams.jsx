import {useEffect, useState} from "react";

function FeaturedTeams() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        async function fetchFeaturedTeams() {
            try {
                const response = await fetch(
                    "https://v3.football.api-sports.io/standings?league=1&season=2022",
                    {
                        headers: {
                            "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
                        },
                    }
                );

                const data = await response.json();

                const featuredTeams = data.response[0].league.standings
                    .map(group => group[0])
                    .slice(0, 4);

                setTeams(featuredTeams);
            } catch (error) {
                console.error(error);
            }
        }

        fetchFeaturedTeams();
    }, []);


    return (
        <section className="featured">
            <h2>Featured Teams</h2>

            <div className="team-grid">
                {teams.map((team) => (
                    <div key={team.team.id}>
                        <img
                            src={team.team.logo}
                            alt={team.team.name}
                            width="60"
                        />

                        <p>{team.team.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FeaturedTeams;