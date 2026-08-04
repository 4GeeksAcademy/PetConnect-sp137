import React, { useState, useEffect } from "react";
import { VeterinarianCardCheck } from "../components/VeterinarianCardCheck";

export const VeterinariansView = () => {
    const [veterinarians, setVeterinarians] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchVeterinarians = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/veterinarians`);
                if (response.ok) {
                    const data = await response.json();
                    setVeterinarians(data);
                } else {
                    console.error("Failed to fetch veterinarians");
                }
            } catch (error) {
                console.error("Error fetching veterinarians:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVeterinarians();
    }, [backendUrl]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <p>Loading veterinarians...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">
            <h1 className="mb-4 text-center">Veterinarians List</h1>
            {veterinarians.length === 0 ? (
                <p className="text-center text-muted">No veterinarians available.</p>
            ) : (
                <div className="row g-4 justify-content-center">
                    {veterinarians.map((vet) => (
                        <div className="col-12 d-flex justify-content-center" key={vet.id}>
                            <VeterinarianCardCheck
                                id={vet.id}
                                name={vet.name}
                                city={vet.city}
                                address={vet.address}
                                pc={vet.pc}
                                email={vet.email}
                                schedule={vet.schedule}
                                iconUrl={vet.iconUrl}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};