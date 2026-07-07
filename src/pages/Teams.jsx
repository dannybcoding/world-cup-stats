import {useEffect, useState} from "react";

function Teams() {
    //console.log("Teams component rendered");
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        async function fetchCountries() {
            //console.log("Starting fetchCountries");

            const cached = localStorage.getItem("countries");
            const timestamp = Number(localStorage.getItem("countriesTimestamp"));

            const oneDay = 24 * 60 * 60 * 1000;

            const parsed = cached ? JSON.parse(cached) : [];

            if (
                parsed.length > 0 &&
                timestamp &&
                Date.now() - timestamp < oneDay
            ) {
                setCountries(parsed);
                return;
            }

            console.log(import.meta.env.VITE_API_KEY);

            const response = await fetch(
                "https://v3.football.api-sports.io/teams/countries",
                {
                    headers: {
                        "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
                    },
                }
            );

            const data = await response.json();

            console.log(response.status);
            console.log(data);

            const sorted = data.response.sort((a, b) =>
                a.name.localeCompare(b.name)
            );

            setCountries(sorted);

            localStorage.setItem("countries", JSON.stringify(sorted));
            localStorage.setItem("countriesTimestamp", Date.now());
        }

        fetchCountries();
    }, []);

    return (
        <div>
            {countries.map((country) => (
                <div key={country.code}>{country.name}</div>
            ))}
        </div>
    );
}

export default Teams;