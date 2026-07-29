import { Link } from "react-router-dom";
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {


	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate()

	const loadMessage = async () => {
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const response = await fetch(backendUrl + "admin/shelter/")
			const data = await response.json()
			return data
	}




	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">HOME</span>
				</Link>
				<div className="ms-auto d-flex gap-4">
						<button className="btn btn-primary" onClick={() => navigate("/user")}>Ver usuarios</button>
						<button className="btn btn-primary" onClick={() => navigate("/form")}> Crear Refugio </button>
						<button className="btn btn-primary" onClick={() => navigate("/shelter")}>Ver Refugios</button>	
				</div>
			</div>
		</nav>
	);
};