import {useEffect, useState, useRef} from "react";
import "./Teams.css";
import {Link} from "react-router-dom";
import {FaFlag} from "react-icons/fa";


function Teams() {
    //console.log("Teams component rendered");
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState("");

    const countryRefs = useRef({});

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

            //console.log(import.meta.env.VITE_API_KEY);

            const response = await fetch(
                "https://v3.football.api-sports.io/teams?league=1&season=2022",
                {
                    headers: {
                        "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
                    },
                }
            );

            const data = await response.json();

            /*console.log(response.status);
            console.log(data);*/

            const teams = data.response.map(item => item.team);

            teams.sort((a, b) =>
                a.name.localeCompare(b.name)
            );

            setCountries(teams);

            localStorage.setItem("countries", JSON.stringify(teams));

            //console.log(sorted[0]);
            localStorage.setItem("countriesTimestamp", Date.now());
        }

        fetchCountries();
    }, []);

    const filteredCountries =
        search.trim() === ""
            ? []
            : countries
                .filter((country) =>
                    country.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
                .slice(0, 8);

    function jumpToCountry(country) {
        setSearch("");

        countryRefs.current[country.code]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    return (
        <div>
            <h1>Teams</h1>

            <div className="search-container">
                <input
                    data-testid="team-search"
                    type="text"
                    placeholder="Search countries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="country-search"
                />

                {filteredCountries.length > 0 && (
                    <div className="search-results">
                        {filteredCountries.map((country) => (
                            <div
                                key={country.code}
                                className="search-result"
                                onClick={() => jumpToCountry(country)}
                            >


                                {country.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {countries.map((country) => (
                <div
                    className="country"
                    key={country.code}
                    ref={(el) => (countryRefs.current[country.code] = el)}
                >
                    <Link to={`/teams/${country.id}/${country.name.toLowerCase()}`}>
                        {country.name}
                    </Link>

                    {country.logo ? (
                        <img
                            src={country.logo}
                            alt={`${country.name} flag`}
                            className="country-flag"
                        />
                    ) : (
                        <FaFlag
                            className="country-flag-placeholder"
                            title="No flag available"
                            aria-label="No flag available"
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Teams;