import { Link } from "react-router-dom";
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const navigate = useNavigate()
	const { store, dispatch } = useGlobalReducer();

	function logoutAdminUser() {
		navigate('/')
		dispatch({ type: "set_admin_auth", payload: null })
		localStorage.removeItem('adminToken')
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/" className="text-decoration-none">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>

				<div className="d-flex gap-2 align-items-center">

					{store.adminUserAuth ? (
						<>
							<button className="btn btn-danger" onClick={() => logoutAdminUser()}>Logout Admin</button>
						</>
					) : (
						<button className="btn btn-danger" onClick={() => navigate("/adminUserLogin")}>
							Admin Login
						</button>
					)}

					{store.userAuth ? (
						<>
							<button className="btn btn-info" onClick={() => navigate("/dashboard-user")}>User Dashboard</button>
						</>
					) : (
						<button className="btn btn-info" onClick={() => navigate("/userLogin")}>
							User Login
						</button>
					)}

					{store.shelterAuth ? (
						<>
							<button className="btn btn-info" onClick={() => navigate("/ShelterDashboard")}>Shelter Dashboard</button>
						</>
					) : (
						<button className="btn btn-info" onClick={() => navigate("/shelterLogin")}>
							Shelter Login
						</button>
					)}

					{store.veterinarianAuth ? (
						<>
							<button className="btn btn-info" onClick={() => navigate("/veterinarianDashboard")}>Veterinarian Dashboard</button>
						</>
					) : (
						<button className="btn btn-info" onClick={() => navigate("/loginVeterinarian")}>
							Veterinarian Login
						</button>
					)}
				</div>

				<div className="d-flex align-items-center gap-2">

					<button className="btn btn-primary" onClick={() => navigate("/userCreate")}>Register User</button>
					<button className="btn btn-primary" onClick={() => navigate("/ShelterCreate")}>Register Shelter</button>
					<button className="btn btn-primary" onClick={() => navigate("/veterinarian/new")}>Register Veterinarian</button>
					{store.adminUserAuth && (
						<>
							<button className="btn btn-primary" onClick={() => navigate("/user")}>Users</button>
							<button className="btn btn-primary" onClick={() => navigate("/pets")}>Pets</button>
							<button className="btn btn-primary" onClick={() => navigate("/adoptions")}>Adoptions</button>
							<button className="btn btn-primary" onClick={() => navigate("/medapps")}>Medical Appointments</button>
							<button className="btn btn-primary" onClick={() => navigate("/breed")}>Breed</button>
							<button className="btn btn-primary" onClick={() => navigate("/shelter")}>Shelter</button>
							<button className="btn btn-primary" onClick={() => navigate("/veterinarian")}>Veterinarian</button>
						</>
					)}

				</div>
			</div>
		</nav>
	);
};