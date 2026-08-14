import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import petConnectLogo from "../assets/img/pet-connect-navbar.png";

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

				{/* Espacio reservado para los 3 componentes del compañero */}
				<div className="petconnect-teammate-space">
				</div>

				{/* Icono de usuario */}
				<button
					type="button"
					className="petconnect-user-button"
					onClick={() => navigate("/userLogin")}
					aria-label="User login"
				>
					<svg
						className="petconnect-user-icon"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="12"
							cy="8"
							r="4"
							stroke="currentColor"
							strokeWidth="1.8"
						/>
						<path
							d="M4.5 21C5.3 16.8 8 14.5 12 14.5C16 14.5 18.7 16.8 19.5 21"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
						/>
					</svg>
				</button>

			</div>
		</nav>
	);
};