import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav>
      <Link to="/" className="logo">Superhero web app</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login(logout)" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
