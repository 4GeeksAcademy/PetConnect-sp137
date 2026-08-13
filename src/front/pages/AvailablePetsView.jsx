import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { PetAdoptionCard } from "../components/PetAdoptionCard";

export const AvailablePetsView = () => {
    const { store, dispatch } = useGlobalReducer();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [maxDistance, setMaxDistance] = useState(1000);
    const [loading, setLoading] = useState(true);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    };

    useEffect(() => {
        fetch(`${backendUrl}/api/pets/available-for-adoption`)
            .then(res => res.json())
            .then(data => {
                setPets(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching available pets:", err);
                setLoading(false);
            });
    }, [backendUrl]);

    const userLat = store.currentUser?.latitude;
    const userLon = store.currentUser?.longitude;

    const filteredPets = pets.map(pet => {
        const shelterLat = pet.shelter?.latitude;
        const shelterLon = pet.shelter?.longitude;
        const distance = calculateDistance(userLat, userLon, shelterLat, shelterLon);
        return { ...pet, distance };
    }).filter(pet => {
        if (!userLat || !userLon) return true;
        if (pet.distance === null) return false;
        return pet.distance <= maxDistance;
    });

    if (loading) return <div className="text-center mt-5">Loading available pets...</div>;

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center">Find a Pet for Adoption</h2>

            <div className="card p-3 mb-4 shadow-sm bg-light">
                <label htmlFor="distanceRange" className="form-label fw-bold">
                    Max Distance: <span className="text-primary">{maxDistance} km</span>
                </label>
                <input
                    type="range"
                    className="form-range"
                    id="distanceRange"
                    min="0"
                    max="1000"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted small">
                    <span>0 km</span>
                    <span>500 km</span>
                    <span>1000 km</span>
                </div>
            </div>

            {!userLat || !userLon ? (
                <div className="alert alert-warning" role="alert">
                    Your profile does not have latitude and longitude set. Showing all available pets without distance filtering.
                </div>
            ) : null}

            <div className="row">
                {filteredPets.length > 0 ? (
                    filteredPets.map(pet => (
                        <PetAdoptionCard
                            key={pet.id}
                            pet={pet}
                            distance={pet.distance}
                        />
                    ))
                ) : (
                    <div className="col-12 text-center text-muted">
                        No pets found within {maxDistance} km.
                    </div>
                )}
            </div>
        </div>
    );
};