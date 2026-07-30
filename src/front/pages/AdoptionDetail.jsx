import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const AdoptionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(true);
    const [adoption, setAdoption] = useState({
        user_id: "",
        pet_id: "",
        shelter_id: "",
        date: "",
        state: "Sent",
        comment: ""
    });

    useEffect(() => {
        const fetchAdoptionDetail = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/adoptions/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAdoption({
                        user_id: data.user_id,
                        pet_id: data.pet_id,
                        shelter_id: data.shelter_id,
                        date: data.date,
                        state: data.state,
                        comment: data.comment
                    });
                }
            } catch (error) {
                console.error("Error fetching adoption details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdoptionDetail();
    }, [id, backendUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdoption({
            ...adoption,
            [name]: value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/adoptions/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adoption)
            });

            if (response.ok) {
                alert("Adoption updated successfully!");
                navigate("/adoptions");
            } else {
                alert("Failed to update adoption");
            }
        } catch (error) {
            console.error("Error updating adoption:", error);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading adoption details...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/adoptions" className="btn btn-outline-secondary mb-3">
                ← Back to Adoptions List
            </Link>

            <div className="card shadow-sm p-4">
                <h2 className="mb-4">Edit Adoption Request</h2>

                <form onSubmit={handleSave}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">User</label>
                            <input
                                name="user"
                                className="form-control"
                                value={adoption.user_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Pet</label>
                            <input
                                name="pet"
                                className="form-control"
                                value={adoption.pet_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Shelter</label>
                            <input
                                name="shelter"
                                className="form-control"
                                value={adoption.shelter_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                name="date"
                                className="form-control"
                                value={adoption.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">State</label>
                            <select
                                name="state"
                                className="form-select"
                                value={adoption.state}
                                onChange={handleChange}
                                required
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
                                onChange={handleChange}
                                placeholder="Add optional comments..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                            Save Changes
                        </button>
                        <Link to="/adoptions" className="btn btn-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};