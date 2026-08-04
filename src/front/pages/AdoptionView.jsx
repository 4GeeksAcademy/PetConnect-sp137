import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export const AdoptionView = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(true);
    const { store } = useGlobalReducer();
    const [users, setUsers] = useState([]);
    const [pets, setPets] = useState([]);
    const [shelters, setShelters] = useState([]);

    const [adoption, setAdoption] = useState({
        user_id: "",
        pet_id: "",
        shelter_id: "",
        date: "",
        state: "Sent",
        comment: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resUsers, resPets, resShelters, resAdoption] = await Promise.all([
                    fetch(`${backendUrl}/api/user`),
                    fetch(`${backendUrl}/api/pets`),
                    fetch(`${backendUrl}/api/shelter`),
                    fetch(`${backendUrl}/api/adoptions/${id}`)
                ]);

                if (resUsers.ok) setUsers(await resUsers.json());
                if (resPets.ok) setPets(await resPets.json());
                if (resShelters.ok) setShelters(await resShelters.json());

                if (resAdoption.ok) {
                    const data = await resAdoption.json();
                    setAdoption({
                        user_id: data.user_id ? String(data.user_id) : "",
                        pet_id: data.pet_id ? String(data.pet_id) : "",
                        shelter_id: data.shelter_id ? String(data.shelter_id) : "",
                        date: data.date || "",
                        state: data.state || "Sent",
                        comment: data.comment || ""
                    });
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, backendUrl]);

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading adoption details...</p>
            </div>
        );
    }

    if (!store.adminUserAuth) {
        return (
            <div className="container mt-4">
                <p>Private Admin</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/adoptions" className="btn btn-outline-secondary mb-3">
                ← Back to Adoptions List
            </Link>

            <div className="card shadow-sm p-4">
                <h2 className="mb-4">View Adoption Request</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">User</label>
                            <select
                                name="user_id"
                                className="form-select"
                                value={String(adoption.user_id)}
                                disabled
                            >
                                <option value="">Select a user</option>
                                {users.map((item) => (
                                    <option key={item.id} value={String(item.id)}>
                                        {item.name || item.email || `User #${item.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Pet</label>
                            <select
                                name="pet_id"
                                className="form-select"
                                value={String(adoption.pet_id)}
                                disabled
                            >
                                <option value="">Select a pet</option>
                                {pets.map((item) => (
                                    <option key={item.id} value={String(item.id)}>
                                        {item.name || `Pet #${item.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Shelter</label>
                            <select
                                name="shelter_id"
                                className="form-select"
                                value={String(adoption.shelter_id)}
                                disabled
                            >
                                <option value="">Select a shelter</option>
                                {shelters.map((item) => (
                                    <option key={item.id} value={String(item.id)}>
                                        {item.name || `Shelter #${item.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                name="date"
                                className="form-control"
                                value={adoption.date}
                                disabled
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">State</label>
                            <select
                                name="state"
                                className="form-select"
                                value={adoption.state}
                                disabled
                            >
                                <option value="Sent">Sent</option>
                                <option value="Paid">Paid</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">Comment</label>
                            <textarea
                                name="comment"
                                className="form-control"
                                rows="3"
                                value={adoption.comment}
                                disabled
                            ></textarea>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};