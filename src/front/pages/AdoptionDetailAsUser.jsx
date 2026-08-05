import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AdoptionDetailAsUser = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { store } = useGlobalReducer();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const currentUserId = store.currentUser?.id;
    const userToken = store.userAuth;
    const selectedPet = location.state?.pet;

    const [users, setUsers] = useState([]);
    const [pets, setPets] = useState([]);
    const [shelters, setShelters] = useState([]);

    const todayStr = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        user_id: currentUserId || "",
        pet_id: selectedPet?.id || "",
        shelter_id: selectedPet?.shelter_id || "",
        date: todayStr,
        comment: "",
        state: "sent"
    });

    useEffect(() => {
        if (!store.userAuth) {
            navigate("/userLogin");
            return;
        }

        const fetchData = async () => {
            try {
                const headers = { "Authorization": `Bearer ${userToken}` };
                const [usersRes, petsRes, sheltersRes] = await Promise.all([
                    fetch(`${backendUrl}/api/user`, { headers }),
                    fetch(`${backendUrl}/api/pets`, { headers }),
                    fetch(`${backendUrl}/api/shelter`, { headers })
                ]);

                if (usersRes.ok) setUsers(await usersRes.json());
                if (petsRes.ok) setPets(await petsRes.json());
                if (sheltersRes.ok) setShelters(await sheltersRes.json());
            } catch (error) {
                console.error("Error fetching dependencies for adoption:", error);
            }
        };

        fetchData();
    }, [store.userAuth, userToken, backendUrl, navigate]);

    const userFound = users.find((u) => String(u.id) === String(formData.user_id));
    const petFound = pets.find((p) => String(p.id) === String(formData.pet_id));
    const shelterFound = shelters.find((s) => String(s.id) === String(formData.shelter_id));

    const handleChange = (e) => {
        setFormData({
            ...formData,
            comment: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/adoptions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Adoption request sent successfully!");
                navigate("/dashboard-user");
            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                alert("Failed to send adoption request");
            }
        } catch (error) {
            console.error("Error submitting adoption:", error);
        }
    };

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

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center bg-light">
                            <h5 className="card-title mb-0">New Adoption Request</h5>
                            <span className={`badge ${getStatusBadgeClass(formData.state)}`}>
                                {formData.state}
                            </span>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label"><strong>User:</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userFound ? userFound.name : "Loading..."}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label"><strong>Pet:</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={petFound ? petFound.name : "Loading..."}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label"><strong>Shelter:</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={shelterFound ? shelterFound.name : "Loading..."}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label"><strong>Date:</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.date}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label"><strong>Comment:</strong></label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        placeholder="Write any comments or notes for your adoption request..."
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        Submit Adoption Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};