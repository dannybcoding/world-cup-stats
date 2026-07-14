import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./TeamPage.css";


function TeamPage() {

   const { teamId, countryName } = useParams();

    const [players, setPlayers] = useState([]);
    const [team, setTeam] = useState(null);


    useEffect(() => {

        async function fetchTeam() {

            const key = import.meta.env.VITE_API_FOOTBALL_KEY;


            // Get team ID
            const teamResponse = await fetch(
                `https://v3.football.api-sports.io/teams?id=${teamId}`,
                {
                    headers: {
                        "x-apisports-key": key
                    }
                }
            );


            const teamData = await teamResponse.json();

            console.log(teamData);


            const teamInfo = teamData.response[0].team;

            setTeam(teamInfo);


            // Get roster
            const squadResponse = await fetch(
                `https://v3.football.api-sports.io/players/squads?team=${teamId}`,
                {
                    headers: {
                        "x-apisports-key": key
                    }
                }
            );


            const squadData = await squadResponse.json();

            console.log(squadData);


            setPlayers(
                squadData.response[0].players
            );

        }


        fetchTeam();


    }, [countryName]);


    return (

        <div className="team-page">

            {team && (
                <>
                    <img
                        src={team.logo}
                        alt={team.name}
                    />

                    <h1>{team.name}</h1>
                </>
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

        </div>

    );
}


export default TeamPage;