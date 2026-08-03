import {useEffect, useState, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./Teams.css";
import {FaFlag} from "react-icons/fa";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";


function Teams() {
    //console.log("Teams component rendered");
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState("");
    const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
    const [activePageIndex, setActivePageIndex] = useState(-1);

    const countryRefs = useRef({});
    const suggestionRefs = useRef({});

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
        setActiveSearchIndex(-1);
        const pageIndex = countries.findIndex((item) => item.code === country.code);
        setActivePageIndex(pageIndex);

        countryRefs.current[country.code]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }

    const activeSearchCountry =
        activeSearchIndex >= 0 && activeSearchIndex < filteredCountries.length
            ? filteredCountries[activeSearchIndex]
            : null;

    const activePageCountry =
        activePageIndex >= 0 && activePageIndex < countries.length
            ? countries[activePageIndex]
            : null;

    function navigateToTeamPage(country) {
        navigate(`/teams/${country.id}/${country.name.toLowerCase()}`);
    }

    useEffect(() => {
        function onKeyDown(event) {
            handleKeyDown(event);
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [countries, filteredCountries, activeSearchIndex, activePageIndex]);

    function handleKeyDown(event) {
        if (filteredCountries.length > 0) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActivePageIndex(-1);
                setActiveSearchIndex((prevIndex) =>
                    prevIndex < filteredCountries.length - 1
                        ? prevIndex + 1
                        : 0
                );
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                setActivePageIndex(-1);
                setActiveSearchIndex((prevIndex) =>
                    prevIndex > 0
                        ? prevIndex - 1
                        : filteredCountries.length - 1
                );
                return;
            }

            if (event.key === "Enter") {
                event.preventDefault();
                const country = activeSearchCountry ?? filteredCountries[0];
                if (country) {
                    jumpToCountry(country);
                }
                return;
            }

            return;
        }

        if (countries.length === 0) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActivePageIndex((prevIndex) =>
                prevIndex < countries.length - 1
                    ? prevIndex + 1
                    : 0
            );
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActivePageIndex((prevIndex) =>
                prevIndex > 0
                    ? prevIndex - 1
                    : countries.length - 1
            );
            return;
        }

        if (event.key === "Enter" && activePageCountry) {
            event.preventDefault();
            navigateToTeamPage(activePageCountry);
        }
    }

    return (
        <div>
            <Navbar/>
            <h1 className="page-header">Teams</h1>

            <div className="search-container">
                <input
                    data-testid="team-search"
                    type="text"
                    placeholder="Search countries..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setActiveSearchIndex(-1);
                        setActivePageIndex(-1);
                    }}
                    className="country-search"
                    aria-autocomplete="list"
                    aria-controls="country-search-list"
                    aria-activedescendant={
                        activeSearchCountry ? `country-option-${activeSearchCountry.code}` : undefined
                    }
                />

                {filteredCountries.length > 0 && (
                    <div className="search-results" id="country-search-list" role="listbox">
                        {filteredCountries.map((country, index) => (
                            <div
                                key={country.code}
                                id={`country-option-${country.code}`}
                                role="option"
                                aria-selected={activeSearchIndex === index}
                                className={`search-result ${activeSearchIndex === index ? "active" : ""}`}
                                onClick={() => jumpToCountry(country)}
                                ref={(el) => {
                                    if (el) {
                                        suggestionRefs.current[country.code] = el;
                                    }
                                }}
                            >
                                {country.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {countries.map((country, index) => (
                <div
                    className={`country${activePageIndex === index ? " active-page" : ""}`}
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
            <Footer/>
        </div>

    );
}

export default Teams;