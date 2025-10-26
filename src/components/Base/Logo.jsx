import { NavLink } from "react-router";

export default function Logo() {
  return (
    <NavLink to="/" className="navbar-brand">
      Movie App
    </NavLink>
  );
}
