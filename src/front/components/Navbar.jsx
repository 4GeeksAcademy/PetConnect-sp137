import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import petConnectLogo from "../assets/img/pet-connect-navbar.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SocialIcons.css";
import SocialIcons from "./SocialIcons";

export const Navbar = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    function logoutAdminUser() {
        navigate("/");
        dispatch({ type: "set_admin_auth", payload: null });
        localStorage.removeItem("adminToken");
    }

    return (
        <nav className="petconnect-navbar">
            <div className="petconnect-navbar-container">

                {/* Logo */}
                <Link to="/" className="petconnect-logo">
                    <img
                        src={petConnectLogo}
                        alt="Pet Connect"
                        className="petconnect-logo-image"
                    />
                </Link>

                {/* Menú principal */}
                <div className="petconnect-menu">

                    <Link to="/" className="petconnect-nav-link">
                        HOME
                    </Link>

                    <Link to="/team" className="petconnect-nav-link">
                        TEAM
                    </Link>

                    <Link to="/about" className="petconnect-nav-link">
                        ABOUT US
                    </Link>

                    <Link to="/contact" className="petconnect-nav-link">
                        CONTACT
                    </Link>

                </div>

                {/* Iconos sociales */}
                <div className="petconnect-social-wrapper">
                    <SocialIcons />
                </div>

                {/* Acciones de usuario */}
                <div className="petconnect-actions">

                    {/* Login */}
                    <button
                        type="button"
                        className="petconnect-user-button"
                        onClick={() => navigate("/loginPage")}
                        aria-label="Login"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 23 23"
                        >
                            <rect
                                width="24"
                                height="24"
                                fill="white"
                                rx="0"
                            />
                            <path
                                fill="#5375e9"
                                d="M18 4h2v16h-2zm-8 13 6-5-6-5v4H3v2h7z"
                            />
                        </svg>
                    </button>

                    {/* Adoption survey */}
                    <button
                        className="petconnect-adoption-button"
                        onClick={() => navigate("/adoption-survey")}
                    >
                        Adoption Survey
                    </button>

                </div>

            </div>
        </nav>
    );
};
