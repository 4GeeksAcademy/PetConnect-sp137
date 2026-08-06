import React, { useState, useEffect } from "react";

export const AdoptionCardAsUser = ({ adoption }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const userToken = localStorage.getItem("userToken");

    const [pet, setPet] = useState(null);
    const [shelter, setShelter] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getStatusBadgeClass = (state) => {
        switch (state?.toLowerCase()) {
            case "sent":
                return "bg-primary";
            case "paid":
                return "bg-success";
            case "rejected":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const headers = { "Authorization": `Bearer ${userToken}` };

                const petId = adoption?.pet_id || adoption?.petId;
                const shelterId = adoption?.shelter_id || adoption?.idShelter;
                const userId = adoption?.user_id;

                const requests = [];
                if (petId) requests.push(fetch(`${backendUrl}/api/pets/${petId}`, { headers }).then(res => res.ok ? res.json() : null));
                else requests.push(Promise.resolve(null));

                if (shelterId) requests.push(fetch(`${backendUrl}/api/shelter/${shelterId}`, { headers }).then(res => res.ok ? res.json() : null));
                else requests.push(Promise.resolve(null));

                if (userId) requests.push(fetch(`${backendUrl}/api/user/${userId}`, { headers }).then(res => res.ok ? res.json() : null));
                else requests.push(Promise.resolve(null));

                const [petData, shelterData, userData] = await Promise.all(requests);

                setPet(petData);
                setShelter(shelterData);
                setUser(userData);
            } catch (error) {
                console.error("Error fetching card details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCardData();
    }, [adoption, backendUrl, userToken]);

    return (
        <div className="col-md-4">
            <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                    <span className={`badge ${getStatusBadgeClass(adoption?.state)}`}>
                        {adoption?.state || "Unknown"}
                    </span>
                </div>
                <div className="card-body">
                    <p className="card-text mb-1">
                        <strong>User:</strong> {loading ? "Loading..." : (user?.name || "Not specified")}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Pet:</strong> {loading ? "Loading..." : (pet?.name || "Not specified")}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Shelter:</strong> {loading ? "Loading..." : (shelter?.name || "Not specified")}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Date:</strong> {adoption?.date ? adoption.date.split("T")[0] : "N/A"}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Comment:</strong> {adoption?.comment || "No comments provided."}
                    </p>
                </div>
            </div>
        </div>
    );
};