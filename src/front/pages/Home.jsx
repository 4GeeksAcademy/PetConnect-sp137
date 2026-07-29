import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate()

	const loadMessage = async () => {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

	

			const response = await fetch(backendUrl + "admin/shelter/")
			const data = await response.json()

	

			return data
	}

	return (
		<div className="text-center mt-5">
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