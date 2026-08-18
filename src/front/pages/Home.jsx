import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import pet1 from "../assets/img/pet1.jpg";
import pet2 from "../assets/img/pet2.jpg";
import pet3 from "../assets/img/pet3.jpg";
import shelterPatitas from "../assets/img/Patitas felices.jpg";
import shelterEsperanza from "../assets/img/Refugio esperanza.jpg";
import shelterAmigos from "../assets/img/amigos de 4 patas.jpg";
import pawsCareImage from "../assets/img/Paws & care.jpg";
import safePawsImage from "../assets/img/Safe paws.png";
import vetPartnersImage from "../assets/img/Vet partners.jpg";
import happyHomesImage from "../assets/img/Happy homes.jpg";
import dogsCommunityImage from "../assets/img/Dogs community.webp";

export const Home = () => {
	const navigate = useNavigate();

	const adoptionImages = [pet1, pet2, pet3];

	const [currentImage, setCurrentImage] = useState(0);
	const [shelters, setShelters] = useState([]);
	const [pets, setPets] = useState([]);
	const [breedImages, setBreedImages] = useState({});
	const shelterImages = [
		shelterPatitas,
		shelterEsperanza,
		shelterAmigos
	];
	const [featuredImages, setFeaturedImages] = useState([]);

	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	// =========================================
	// HERO SLIDER
	// =========================================

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((prev) => (prev + 1) % adoptionImages.length);
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
				setShelters(Array.isArray(data) ? data.slice(0, 4) : []);
			} catch (error) {
				console.error("Error fetching shelters:", error);
			}
		};

		fetchShelters();
	}, [backendUrl]);

	// =========================================
	// DOG BREEDS
	// =========================================

	useEffect(() => {
		const breeds = [
			{ name: "Golden Retriever", apiName: "retriever/golden" },
			{ name: "German Shepherd", apiName: "german/shepherd" },
			{ name: "Labrador Retriever", apiName: "labrador" },
			{ name: "French Bulldog", apiName: "bulldog/french" },
			{ name: "Beagle", apiName: "beagle" },
			{ name: "Husky", apiName: "husky" },
		];

		const loadBreedImages = async () => {
			try {
				const results = await Promise.all(
					breeds.map(async (breed) => {
						const response = await fetch(
							`https://dog.ceo/api/breed/${breed.apiName}/images/random`
						);

						const data = await response.json();

						return {
							name: breed.name,
							image: data.message,
						};
					})
				);

				const images = {};

				results.forEach((breed) => {
					images[breed.name] = breed.image;
				});

				setBreedImages(images);

			} catch (error) {
				console.error("Error loading breed images:", error);
			}
		};

		loadBreedImages();
	}, []);

	// =========================================
	// HOME SECTION IMAGES
	// =========================================

	useEffect(() => {
		const loadHomeImages = async () => {
			try {
				const [featuredResponse, shelterResponse] = await Promise.all([
					fetch("https://dog.ceo/api/breeds/image/random/3"),
					fetch("https://dog.ceo/api/breeds/image/random/3"),
				]);

				const featuredData = await featuredResponse.json();
				const shelterData = await shelterResponse.json();

				if (featuredData.status === "success") {
					setFeaturedImages(featuredData.message);
				}

			} catch (error) {
				console.error("Error loading home images:", error);
			}
		};

		loadHomeImages();
	}, []);


	// =========================================
	// LOAD PETS
	// =========================================

	useEffect(() => {
		const fetchPets = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/pets`);

				if (!response.ok) {
					throw new Error("Error loading pets");
				}

				const data = await response.json();
				setPets(Array.isArray(data) ? data : []);
			} catch (error) {
				console.error("Error fetching pets:", error);
			}
		};

		fetchPets();
	}, [backendUrl]);

	// =========================================
	// STATIC BREEDS
	// =========================================

	const breeds = [
		{
			name: "Labrador Retriever",
			description: "Friendly, loyal and loving companions.",
		},
		{
			name: "Golden Retriever",
			description: "Affectionate dogs perfect for families.",
		},
		{
			name: "German Shepherd",
			description: "Intelligent, loyal and protective.",
		},
		{
			name: "Beagle",
			description: "Playful, curious and full of energy.",
		},
		{
			name: "French Bulldog",
			description: "Small, affectionate and charming.",
		},
		{
			name: "Husky",
			description: "Energetic, friendly and adventurous.",
		},
	];

	const displayPets = pets.length
		? pets.slice(0, 6)
		: [
			{
				id: 1,
				name: "Ares",
				breed: "Labrador Retriever",
			},
			{
				id: 2,
				name: "Luna",
				breed: "Golden Retriever",
			},
			{
				id: 3,
				name: "Max",
				breed: "German Shepherd",
			},
			{
				id: 4,
				name: "Toby",
				breed: "Beagle",
			},
		];

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
						backgroundImage: `url(${adoptionImages[currentImage]})`,
					}}
				>
					<div className="petconnect-card-overlay"></div>

					<div className="petconnect-card-content">
						<span className="petconnect-card-label">ADOPT</span>

						<h1>
							Find
							<br />
							a new home
						</h1>

						<p>
							Discover dogs waiting for a family and give them
							a second chance.
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

				<div className="petconnect-hero-side">

					{/* CARE */}
					<div
						className="petconnect-hero-card petconnect-side-card petconnect-cuida"
						style={{
							backgroundImage: `url(${pet2})`,
						}}
					>
						<div className="petconnect-card-overlay"></div>

						<div className="petconnect-card-content">
							<span className="petconnect-card-label">CARE</span>

							<h2>
								Take care of your
								<br />
								best friend
							</h2>

							<p>
								Find veterinary professionals to care for your
								dog's health and well-being.
							</p>

							<button
								className="petconnect-card-button"
								onClick={() => navigate("/veterinariansView")}
							>
								View veterinarians
							</button>
						</div>
					</div>

					{/* CONNECT */}
					<div
						className="petconnect-hero-card petconnect-side-card petconnect-conecta"
						style={{
							backgroundImage: `url(${pet3})`,
						}}
					>
						<div className="petconnect-card-overlay"></div>

						<div className="petconnect-card-content">
							<span className="petconnect-card-label">CONNECT</span>

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
			    DOGS BY BREED
			========================================= */}

			<section className="pc-home-section pc-breeds-section">

				<div className="pc-section-heading">
					<span>EXPLORE</span>
					<h2>Dogs by Breed</h2>
					<p>
						Discover different breeds and find the companion
						that is right for you.
					</p>
				</div>

				<div className="pc-breed-grid">
					{breeds.map((breed) => (
						<div className="pc-breed-card" key={breed.name}>
							<div className="pc-breed-image">
								<img
									src={breedImages[breed.name]}
									alt={breed.name}
								/>
							</div>

							<div className="pc-breed-content">
								<h3>{breed.name}</h3>
								<p>{breed.description}</p>
								<button
									onClick={() => navigate("/breed")}
								>
									Explore breed
								</button>
							</div>
						</div>
					))}
				</div>

			</section>


			{/* =========================================
			    BEST SHELTERS
			========================================= */}

			<section className="pc-home-section pc-shelters-section">

				<div className="pc-section-heading">
					<span>ADOPTION</span>
					<h2>Best Shelters</h2>
					<p>
						Meet the shelters and organizations helping dogs
						find loving homes.
					</p>
				</div>

				<div className="pc-shelter-grid">
					{shelters.length > 0 ? (
						shelters.map((shelter, index) => (
							<article
								className="pc-shelter-card"
								key={shelter.id}
							>
								<div className="pc-shelter-image">
									<img
										src={shelterImages[index]}
										alt={shelter.name}
									/>
								</div>

								<div className="pc-shelter-content">
									<span>SHELTER</span>
									<h3>{shelter.name}</h3>
									<p>{shelter.city || "Spain"}</p>

									<button
										onClick={() =>
											navigate("/sheltersView")
										}
									>
										View shelter
									</button>
								</div>
							</article>
						))
					) : (
						<div className="pc-empty-message">
							No shelters available yet.
						</div>
					)}
				</div>

				<button
					className="pc-main-button"
					onClick={() => navigate("/sheltersView")}
				>
					View all shelters
				</button>

			</section>


			{/* =========================================
			    FAITHFUL COMPANION BANNER
			========================================= */}

			<section className="pc-companion-banner">

				<div
					className="pc-companion-image"
					style={{
						backgroundImage:
							"url(https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=80)",
					}}
				></div>

				<div className="pc-companion-content">
					<span>FIND YOUR COMPANION</span>

					<h2>
						More than a pet.
						<br />
						A lifelong friend.
					</h2>

					<p>
						Every dog deserves a loving home. Find the companion
						that is waiting to become part of your family.
					</p>

					<button
						className="pc-main-button"
						onClick={() => navigate("/sheltersView")}
					>
						Find a dog
					</button>
				</div>

			</section>


			{/* =========================================
			    FEATURED ADOPTIONS
			========================================= */}

			<section className="pc-home-section">

				<div className="pc-section-heading">
					<span>ADOPTION</span>
					<h2>Featured Adoptions</h2>
					<p>
						These dogs are waiting for someone to give them
						a loving home.
					</p>
				</div>

				<div className="pc-pet-grid">
					{displayPets.slice(0, 3).map((pet, index) => (
						<article className="pc-pet-card" key={pet.id || index}>
							<div className="pc-pet-image">
								<img
									src={
										pet.photo_url ||
										pet.photoUrl ||
										breedImages[pet.breed?.name || pet.breed] ||
										featuredImages[index]
									}
									alt={pet.name}
									onError={(event) => {
										if (featuredImages[index]) {
											event.currentTarget.src = featuredImages[index];
										}
									}}
								/>
								<span>ADOPTION</span>
							</div>

							<div className="pc-pet-content">
								<h3>{pet.name}</h3>
								<p>
									{pet.breed?.name ||
										pet.breed ||
										"Dog looking for a home"}
								</p>

								<button
									onClick={() =>
										navigate("/sheltersView")
									}
								>
									Meet this dog
								</button>
							</div>
						</article>
					))}
				</div>

			</section>


			{/* =========================================
			    OUR PARTNERS
			========================================= */}

			<section className="pc-partners-section">

				<div className="pc-section-heading">
					<span>TOGETHER</span>
					<h2>Our Partners</h2>
					<p>
						Building a better future for dogs together.
					</p>
				</div>

				<div className="pc-partners-grid">

					<div className="pc-partner-card">
						<img src={pawsCareImage} alt="Paws & Care" />
						<span>PAWS & CARE</span>
					</div>

					<div className="pc-partner-card">
						<img src={safePawsImage} alt="Safe Paws" />
						<span>SAFE PAWS</span>
					</div>

					<div className="pc-partner-card">
						<img src={vetPartnersImage} alt="Vet Partners" />
						<span>VET PARTNERS</span>
					</div>

					<div className="pc-partner-card">
						<img src={happyHomesImage} alt="Happy Homes" />
						<span>HAPPY HOMES</span>
					</div>

					<div className="pc-partner-card">
						<img src={dogsCommunityImage} alt="Dogs Community" />
						<span>DOGS COMMUNITY</span>
					</div>

				</div>

			</section>

		</main>
	);
};
