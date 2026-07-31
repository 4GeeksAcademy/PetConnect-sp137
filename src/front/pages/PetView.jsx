import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export const PetView = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(true);
    const [pet, setPet] = useState(null);
    const [users, setUsers] = useState([]);
    const [shelters, setShelters] = useState([]);
    const [breeds, setBreeds] = useState([]);

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const [resUsers, resShelters, resBreeds, resPet] = await Promise.all([
                    fetch(`${backendUrl}/api/user`),
                    fetch(`${backendUrl}/api/shelter`),
                    fetch(`${backendUrl}/api/breed`),
                    fetch(`${backendUrl}/api/pets/${id}`)
                ]);

                if (resUsers.ok) setUsers(await resUsers.json());
                if (resShelters.ok) setShelters(await resShelters.json());
                if (resBreeds.ok) setBreeds(await resBreeds.json());

                if (resPet.ok) {
                    const data = await resPet.json();
                    setPet(data);
                }
            } catch (error) {
                console.error("Error fetching pet details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
    }, [id, backendUrl]);

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading pet details...</p>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="container mt-4">
                <p>Pet not found.</p>
                <Link to="/pets" className="btn btn-outline-secondary">
                    ← Back to Pets List
                </Link>
            </div>
        );
    }

    const breedName = breeds.find(b => b.id === pet.breed_id)?.breedName || "Not specified";
    const userName = users.find(u => u.id === pet.user_id)?.name || "Not assigned";
    const shelterName = shelters.find(s => s.id === pet.shelter_id)?.name || "Not assigned";

    return (
        <div className="container mt-4">
            <Link to="/pets" className="btn btn-primary mb-3">
                ← Back to Pets List
            </Link>

            <div className="card shadow-sm">
                <div className="row g-0">
                    {pet.photoUrl && (
                        <div className="col-md-5">
                            <img
                                src={pet.photoUrl}
                                className="img-fluid rounded-start h-100"
                                alt={pet.name}
                                style={{ objectFit: "cover", width: "100%", maxHeight: "400px" }}
                            />
                        </div>
                    )}
                    <div className={`col-md-${pet.photoUrl ? "7" : "12"}`}>
                        <div className="card-body">
                            <h2 className="card-title">{pet.name}</h2>
                            <hr />
                            <p className="card-text"><strong>Breed:</strong> {breedName}</p>
                            <p className="card-text"><strong>User:</strong> {userName}</p>
                            <p className="card-text"><strong>Shelter:</strong> {shelterName}</p>
                            <p className="card-text"><strong>Gender:</strong> {pet.genre}</p>
                            <p className="card-text"><strong>Size:</strong> {pet.size}</p>
                            <p className="card-text"><strong>Color:</strong> {pet.color}</p>
                            <p className="card-text"><strong>Birth Date:</strong> {pet.birthDate || "Not provided"}</p>
                            <p className="card-text"><strong>Chip Number:</strong> {pet.chipNumber || "No chip"}</p>
                            <p className="card-text"><strong>Castrated:</strong> {pet.castrated ? "Yes" : "No"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};