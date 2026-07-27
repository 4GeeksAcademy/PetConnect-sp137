import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate()

	const loadMessage = async () => {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "admin/shelter/")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data
	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">



			{/* Botón */}
			<div className="mb-4 mt-4 d-flex justify-content-center gap-3">
				<button
					className="btn btn-primary btn-lg"
					onClick={() => navigate("/form")}
				>
					Crear Refugio
				</button>


				<button
					className="btn btn-primary btn-lg"
					onClick={() => navigate("/shelter")}
				>
					Ver Refugios
				</button>
			</div>










			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p>
			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
		</div>
	);
}; 