import React from "react";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { NavLink } from "react-router";

export default function SearchForm({ ShoweLinks = false }) {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken._r || decodedToken.role; // senin tokenındaki claim ismi "_r"
        setRole(userRole);
        localStorage.setItem("role", userRole);
      } catch (error) {
        console.error("Token decode hatası:", error);
      }
    }
  }, []);
  const [searchQuery, setSearchQuery] = React.useState("");
  const location = useLocation(); // bulunduğun route

  function handleSubmit(e) {
    e.preventDefault(); // sayfanın yenilenmesini engelle
    const query = searchQuery.trim();
    if (query) {
      // ✅ Bulunduğun sayfaya göre hedef route seç
      let basePath = "/movies/search"; // fallback
      if (location.pathname.startsWith("/movies") || "") {
        basePath = "/movies/search";
      } else if (location.pathname.startsWith("/tvseries")) {
        basePath = "/tvseries/search";
      }

      navigate(`${basePath}?query=${encodeURIComponent(query)}&page=1`);
      setSearchQuery("");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    navigate("/"); // Ana sayfaya yönlendir
  };

  return (
    (
      <form className="d-flex mb-2 mb-lg-0 ms-auto" onSubmit={handleSubmit}>
        <input
          type="search"
          className="form-control me-2 w-100"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-outline-light" type="submit">
          <i className="bi bi-search"></i>
        </button>
      
        {ShoweLinks && (
          <ul className="navbar-nav ms-auto">
            {!role && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link " to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link " to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {(role === "admin" || role === "user") && (
              <>
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Hesabim
                  </NavLink>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink className="dropdown-item bg-dark" to="#">
                        Ayarlar
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="dropdown-item bg-dark"
                        onClick={handleLogout}
                        to="#"
                      >
                        Cikis Yap
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item bg-dark" to="#">
                        Something else here
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li>
                  <NavLink className="nav-link " to="/favorites">
                      <i className="bi bi-heart-fill"></i>
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-link " to="/watchlist">
                      <i className="bi bi-bookmark-fill"></i>
                  </NavLink>
                </li>
              </>
            )}

            {role === "admin" && (
              <li className="nav-item">
                <NavLink className="nav-link text-danger" to="/admin">
                  admin
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </form>
    )
  );
}
