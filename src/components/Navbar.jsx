import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>World Cup Stats</h2>

      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/teams">Teams</Link>
        </li>

        <li>
          <Link to="/players">Players</Link>
        </li>

        <li>
          <Link to="/stats">Stats</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;