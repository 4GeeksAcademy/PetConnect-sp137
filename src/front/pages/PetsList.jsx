import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PetCard } from "../components/PetCard";

export const PetsList = () => {
    const [pets, setPets] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchPets = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/pets`);
            if (response.ok) {
                const data = await response.json();
                setPets(data);
            }
        } catch (error) {
            console.error("Error fetching pets:", error);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pet?")) return;

        try {
            const response = await fetch(`${backendUrl}/api/pets/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchPets();
            }
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Pets List</h1>
                <Link to="/create-pet" className="btn btn-primary">
                    + Create Pet
                </Link>
            </div>

            {pets.length === 0 ? (
                <p className="text-muted">No pets registered yet.</p>
            ) : (
                <div className="row g-3">
                    {pets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};