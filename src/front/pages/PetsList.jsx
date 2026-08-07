import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { PetCard } from "../components/PetCard";

export const PetsList = () => {
    const [pets, setPets] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [shelters, setShelters] = useState([]);
    const [users, setUsers] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    
    const fetchData = async () => {
        try {
            const [resPets, resBreeds, resShelters, resUsers] = await Promise.all([
                fetch(`${backendUrl}/api/pets`),
                fetch(`${backendUrl}/api/breed`),
                fetch(`${backendUrl}/api/shelter`),
                fetch(`${backendUrl}/api/user`)
            ]);

            if (resPets.ok) setPets(await resPets.json());
            if (resBreeds.ok) setBreeds(await resBreeds.json());
            if (resShelters.ok) setShelters(await resShelters.json());
            if (resUsers.ok) setUsers(await resUsers.json());
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pet?")) return;

        try {
            const response = await fetch(`${backendUrl}/api/pets/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    if (!store.adminUserAuth) {
        return (
            <div className="container mt-4">
                <p>Private Admin</p>
            </div>
        );
    }

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
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            breeds={breeds}
                            shelters={shelters}
                            users={users}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};