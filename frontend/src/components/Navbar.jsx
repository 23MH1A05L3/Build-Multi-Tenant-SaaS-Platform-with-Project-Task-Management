import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <Link to="/">SaaS Platform</Link>
      <div>
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
      </div>
    </nav>
  );
}
