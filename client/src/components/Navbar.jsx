import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav>
      <Link to="/" className="logo">Superhero web app</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
        <Link to="/list" className="nav-link">List</Link>
      </div>
    </nav>
  );
}

export default Navbar;
