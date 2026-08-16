import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import pet1 from "../assets/img/pet1.jpg";
import pet2 from "../assets/img/pet2.jpg";
import pet3 from "../assets/img/pet3.jpg";

export const Home = () => {
	const navigate = useNavigate();

	const adoptionImages = [pet1, pet2, pet3];

	const [currentImage, setCurrentImage] = useState(0);
	const [shelters, setShelters] = useState([]);

	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	// =========================================
	// SLIDER ADOPTA
	// =========================================

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage(
				(prev) => (prev + 1) % adoptionImages.length
			);
		}, 4000);

		return () => clearInterval(interval);
	}, []);

	// =========================================
	// CARGAR REFUGIOS
	// =========================================

	useEffect(() => {
		const fetchShelters = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/shelter`);

				if (!response.ok) {
					throw new Error("Error loading shelters");
				}

				const data = await response.json();

				// Mostramos solamente los primeros 3
				setShelters(data.slice(0, 3));

			} catch (error) {
				console.error("Error fetching shelters:", error);
			}
		};

		fetchShelters();
	}, [backendUrl]);

	return (
		<main className="petconnect-home">

			{/* =========================================
                HERO / ADOPTA - CUIDA - CONECTA
            ========================================= */}

			<section className="petconnect-hero">

				{/* ADOPTA */}
				<div
					className="petconnect-hero-card petconnect-adopta"
					style={{
						backgroundImage: `url(${adoptionImages[currentImage]})`
					}}
				>
					<div className="petconnect-card-overlay"></div>

					<div className="petconnect-card-content">
						<span className="petconnect-card-label">
							ADOPTA
						</span>

						<h1>
							Encuentra
							<br />
							un nuevo hogar
						</h1>

						<p>
							Descubre perros que esperan una familia
							y dales una segunda oportunidad.
						</p>

						<button
							className="petconnect-card-button"
							onClick={() => navigate("/sheltersView")}
						>
							Ver refugios
						</button>
					</div>

					<div className="petconnect-slider-dots">
						{adoptionImages.map((_, index) => (
							<button
								key={index}
								className={`petconnect-slider-dot ${currentImage === index ? "active" : ""
									}`}
								onClick={() => setCurrentImage(index)}
								aria-label={`Ver imagen ${index + 1}`}
							/>
						))}
					</div>
				</div>


				{/* COLUMNA DERECHA */}
				<div className="petconnect-hero-side">

					{/* CUIDA */}
					<div
						className="petconnect-hero-card petconnect-side-card petconnect-cuida"
						style={{
							backgroundImage: `url(${pet2})`
						}}
					>
						<div className="petconnect-card-overlay"></div>

						<div className="petconnect-card-content">
							<span className="petconnect-card-label">
								CUIDA
							</span>

							<h2>
								Cuida a tu
								<br />
								mejor amigo
							</h2>

							<p>
								Encuentra profesionales veterinarios
								para cuidar la salud y bienestar de tu perro.
							</p>

							<button
								className="petconnect-card-button"
								onClick={() =>
									navigate("/veterinariansView")
								}
							>
								Ver veterinarios
							</button>
						</div>
					</div>


					{/* CONECTA */}
					<div
						className="petconnect-hero-card petconnect-side-card petconnect-conecta"
						style={{
							backgroundImage: `url(${pet3})`
						}}
					>
						<div className="petconnect-card-overlay"></div>

						<div className="petconnect-card-content">
							<span className="petconnect-card-label">
								CONECTA
							</span>

							<h2>
								Más que una mascota,
								<br />
								un compañero
							</h2>

							<p>
								Conecta con personas, refugios y veterinarios
								que comparten tu amor por los perros.
							</p>

							<button
								className="petconnect-card-button"
								onClick={() => navigate("/userLogin")}
							>
								Únete a Pet Connect
							</button>
						</div>
					</div>

				</div>
			</section>


			{/* =========================================
                INTRODUCCIÓN
            ========================================= */}

			<section className="petconnect-intro">

				<span className="petconnect-intro-label">
					PET CONNECT
				</span>

				<h2>
					Adopta. Cuida. Conecta.
				</h2>

				<p>
					Creamos un espacio donde los perros pueden encontrar
					una familia, recibir el cuidado que necesitan y conectar
					con personas que realmente se preocupan por ellos.
				</p>

			</section>


			{/* =========================================
                REFUGIOS DESTACADOS
            ========================================= */}

			<section className="petconnect-shelters">

				<div className="petconnect-section-heading">

					<span className="petconnect-section-label">
						ADOPCIÓN
					</span>

					<h2>
						Refugios destacados
					</h2>

					<p>
						Conoce algunos de los centros que trabajan
						cada día para encontrar un hogar para nuestros perros.
					</p>

				</div>


				<div className="petconnect-shelters-grid">

					{shelters.map((shelter) => (
						<article
							className="petconnect-shelter-card"
							key={shelter.id}
						>

							<div className="petconnect-shelter-image">

								{shelter.iconUrl ? (
									<img
										src={shelter.iconUrl}
										alt={shelter.name}
									/>
								) : (
									<div className="petconnect-shelter-placeholder">
										🐶
									</div>
								)}

							</div>

							<div className="petconnect-shelter-content">

								<span className="petconnect-shelter-label">
									REFUGIO
								</span>

								<h3>
									{shelter.name}
								</h3>

								<p>
									{shelter.city}
								</p>

								<button
									className="petconnect-shelter-button"
									onClick={() =>
										navigate("/sheltersView")
									}
								>
									Ver refugio
								</button>

							</div>

						</article>
					))}

				</div>


				<div className="petconnect-shelters-action">

					<button
						className="petconnect-view-all-button"
						onClick={() => navigate("/sheltersView")}
					>
						Ver todos los refugios
					</button>

				</div>

			</section>

		</main>
	);
};