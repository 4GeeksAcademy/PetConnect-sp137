import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdoptionCard } from "../components/AdoptionCard";

export const AdoptionsList = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [users, setUsers] = useState([]);
    const [pets, setPets] = useState([]);
    const [shelters, setShelters] = useState([]);
    const { store } = useGlobalReducer();
    
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

    const fetchRelatedData = async () => {
        try {
            const [resUsers, resPets, resShelters] = await Promise.all([
                fetch(`${backendUrl}/api/user`),
                fetch(`${backendUrl}/api/pets`),
                fetch(`${backendUrl}/api/shelter`)
            ]);

            if (resUsers.ok) setUsers(await resUsers.json());
            if (resPets.ok) setPets(await resPets.json());
            if (resShelters.ok) setShelters(await resShelters.json());
        } catch (error) {
            console.error("Error fetching related data:", error);
        }
    };

    useEffect(() => {
        fetchAdoptions();
        fetchRelatedData();
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
                            users={users}
                            pets={pets}
                            shelters={shelters}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};