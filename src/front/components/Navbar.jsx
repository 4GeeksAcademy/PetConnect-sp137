import { Link } from "react-router-dom";
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const navigate = useNavigate()
	const { store, dispatch } = useGlobalReducer();

	function logout() {
		navigate('/shelterLogin')
		dispatch({ type: "set_shelter_auth", payload: null })
		localStorage.removeItem('sheltertoken')
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/" className="text-decoration-none">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>

				<div className="d-flex gap-2 align-items-center">
					{store.shelterAuth ? (
						<>
							<button className="btn btn-info" onClick={() => navigate("/dashboard-user")}>User Dashboard</button>
						</>
					) : (
						<button className="btn btn-info" onClick={() => navigate("/userLogin")}>
							User Login
						</button>
					)}
				</div>
				{
					!store.shelterAuth ? (
						<>
							<Link to="/shelterLogin" className="btn btn-secondary" >
								Shelter Login
							</Link>
							<Link to="/loginVeterinarian" className="btn btn-secondary">
								Veterinarian Login
							</Link>
						</>
					) : (
						<button onClick={logout} className=" btn btn-warning">Desconectar</button>
					)
				}
				<div className="d-flex align-items-center gap-2">
					<button className="btn btn-primary" onClick={() => navigate("/user")}>Users</button>
					<button className="btn btn-primary" onClick={() => navigate("/pets")}>Pets</button>
					<button className="btn btn-primary" onClick={() => navigate("/adoptions")}>Adoptions</button>
					<button className="btn btn-primary" onClick={() => navigate("/medapps")}>Medical Appointments</button>
					<button className="btn btn-primary" onClick={() => navigate("/breed")}>Breed</button>
					<button className="btn btn-primary" onClick={() => navigate("/shelter")}>Shelter</button>
					<button className="btn btn-primary" onClick={() => navigate("/veterinarian")}>Veterinarian</button>
					
				</div>
			</div>
		</nav>
	);
};