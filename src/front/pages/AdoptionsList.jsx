import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdoptionCard } from "../components/AdoptionCard";

export const AdoptionsList = () => {
    const [adoptions, setAdoptions] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchAdoptions = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/adoptions`);
            if (response.ok) {
                const data = await response.json();
                setAdoptions(data);
            }
        } catch (error) {
            console.error("Error fetching adoptions:", error);
        }
    };

    useEffect(() => {
        fetchAdoptions();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this adoption request?")) return;

        try {
            const response = await fetch(`${backendUrl}/api/adoptions/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchAdoptions();
            }
        } catch (error) {
            console.error("Error deleting adoption:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Adoptions List</h1>
                <Link to="/create-adoption" className="btn btn-primary">
                    + Request Adoption
                </Link>
            </div>

            {adoptions.length === 0 ? (
                <p className="text-muted">No adoption requests registered yet.</p>
            ) : (
                <div className="row g-3">
                    {adoptions.map((adoption) => (
                        <AdoptionCard 
                            key={adoption.id} 
                            adoption={adoption} 
                            onDelete={handleDelete} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};