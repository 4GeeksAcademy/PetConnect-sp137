import React, { useState, useEffect } from "react";
import { ShelterCardCheck } from "../components/ShelterCardCheck";

import shelterPatitas from "../assets/img/Patitas felices.jpg";
import shelterEsperanza from "../assets/img/Refugio esperanza.jpg";
import shelterAmigos from "../assets/img/amigos de 4 patas.jpg";

export const SheltersView = () => {
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const shelterImages = [
        shelterPatitas,
        shelterEsperanza,
        shelterAmigos
    ];

    useEffect(() => {
        const fetchShelters = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/shelter`);

                if (response.ok) {
                    const data = await response.json();
                    setShelters(data);
                } else {
                    console.error("Failed to fetch shelters");
                }
            } catch (error) {
                console.error("Error fetching shelters:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShelters();
    }, [backendUrl]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <p>Loading shelters...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">

            <h1 className="mb-4 text-center">
                Shelters List
            </h1>

            {shelters.length === 0 ? (
                <p className="text-center text-muted">
                    No shelters available.
                </p>
            ) : (
                <div className="row g-4 justify-content-center">

                    {shelters.map((shelter, index) => (
                        <div className="col-12 col-md-6 d-flex justify-content-center" key={shelter.id}>
                            <ShelterCardCheck
                                id={shelter.id}
                                name={shelter.name}
                                city={shelter.city}
                                address={shelter.address}
                                pc={shelter.pc}
                                cif={shelter.cif}
                                email={shelter.email}
                                iconUrl={shelterImages[index % shelterImages.length]}
                            />
                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};