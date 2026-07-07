import {Link} from "react-router-dom";

function Hero() {
    return (
        <section className="hero">
            <h1>FIFA World Cup Stats</h1>
            <p>Explore teams, players, and tournament history</p>

            <Link to="/teams">
                <button>Explore Teams</button>
            </Link>
        </section>
    );
}

export default Hero;