import {Link} from "react-router-dom";

function Hero() {
    return (
        <section className="hero">
            <h1 className="page-header">FIFA World Cup Stats</h1>
            <p>Explore teams, players, and tournament history</p>

                <Link to="/teams">
                    <button className="btn-nav" aria-label="Explore teams">Explore Teams</button>
                </Link>
        </section>
    );
}

export default Hero;