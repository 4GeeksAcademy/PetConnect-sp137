import { Link } from "react-router-dom";
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const navigate = useNavigate()
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/" className="text-decoration-none">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>

				<div className="d-flex align-items-center gap-2">
					<button className="btn btn-primary" onClick={() => navigate("/user")}>Ver usuarios</button>
					<Link to="/pets">
						<button className="btn btn-primary">Pets</button>
					</Link>
					<Link to="/adoptions">
						<button className="btn btn-primary">Adoptions</button>
					</Link>
					<Link to="/medapps">
						<button className="btn btn-primary">Medical Appointments</button>
					</Link>
					<Link to="/breed">
						<button className="btn btn-primary">Breed</button>
					</Link>
					<Link to="/shelter">
						<button className="btn btn-primary">Shelter</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};