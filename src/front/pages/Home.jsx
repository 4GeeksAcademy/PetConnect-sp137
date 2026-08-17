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
	// ADOPTION SLIDER
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
	// LOAD SHELTERS
	// =========================================

	useEffect(() => {
		const fetchShelters = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/shelter`);

				if (!response.ok) {
					throw new Error("Error loading shelters");
				}

				const data = await response.json();

				// Show only the first 3
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
                HERO / ADOPT - CARE - CONNECT
            ========================================= */}

			<section className="petconnect-hero">

				{/* ADOPT */}
				<div
					className="petconnect-hero-card petconnect-adopta"
					style={{
						backgroundImage: `url(${adoptionImages[currentImage]})`
					}}
				>
					<div className="petconnect-card-overlay"></div>

					<div className="petconnect-card-content">
						<span className="petconnect-card-label">
							ADOPT
						</span>

						<h1>
							Find
							<br />
							a new home
						</h1>

						<p>
							Discover dogs waiting for a family
							and give them a second chance.
						</p>

						<button
							className="petconnect-card-button"
							onClick={() => navigate("/sheltersView")}
						>
							View shelters
						</button>
					</div>

					<div className="petconnect-slider-dots">
						{adoptionImages.map((_, index) => (
							<button
								key={index}
								className={`petconnect-slider-dot ${currentImage === index ? "active" : ""
									}`}
								onClick={() => setCurrentImage(index)}
								aria-label={`View image ${index + 1}`}
							/>
						))}
					</div>
				</div>


				{/* RIGHT COLUMN */}
				<div className="petconnect-hero-side">

					{/* CARE */}
					<div
						className="petconnect-hero-card petconnect-side-card petconnect-cuida"
						style={{
							backgroundImage: `url(${pet2})`
						}}
					>
						<div className="petconnect-card-overlay"></div>

						<div className="petconnect-card-content">
							<span className="petconnect-card-label">
								CARE
							</span>

							<h2>
								Take care of your
								<br />
								best friend
							</h2>

							<p>
								Find veterinary professionals
								to care for your dog's health and well-being.
							</p>

							<button
								className="petconnect-card-button"
								onClick={() =>
									navigate("/veterinariansView")
								}
							>
								View veterinarians
							</button>
						</div>
					</div>


					{/* CONNECT */}
					<div
						className="petconnect-hero-card petconnect-side-card petconnect-conecta"
						style={{
							backgroundImage: `url(${pet3})`
						}}
					>
						<div className="petconnect-card-overlay"></div>

						<div className="petconnect-card-content">
							<span className="petconnect-card-label">
								CONNECT
							</span>

							<h2>
								More than a pet,
								<br />
								a companion
							</h2>

							<p>
								Connect with people, shelters and veterinarians
								who share your love for dogs.
							</p>

							<button
								className="petconnect-card-button"
								onClick={() => navigate("/userLogin")}
							>
								Join Pet Connect
							</button>
						</div>
					</div>

				</div>
			</section>


			{/* =========================================
                INTRODUCTION
            ========================================= */}

			<section className="petconnect-intro">

				<span className="petconnect-intro-label">
					PET CONNECT
				</span>

				<h2>
					Adopt. Care. Connect.
				</h2>

				<p>
					We created a space where dogs can find
					a family, receive the care they need and connect
					with people who truly care about them.
				</p>

			</section>


			{/* =========================================
                FEATURED SHELTERS
            ========================================= */}

			<section className="petconnect-shelters">

				<div className="petconnect-section-heading">

					<span className="petconnect-section-label">
						ADOPTION
					</span>

					<h2>
						Featured shelters
					</h2>

					<p>
						Meet some of the organizations that work
						every day to find a home for our dogs.
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
									SHELTER
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
									View shelter
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
						View all shelters
					</button>

				</div>

			</section>

		</main>
	);
};