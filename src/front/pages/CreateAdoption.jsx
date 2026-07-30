import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const CreateAdoption = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const initialFormState = {
        user_id: "",
        pet_id: "",
        shelter_id: "",
        date: "",
        state: "Sent",
        comment: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/adoptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Adoption request created successfully!");
                resetForm();
                navigate("/adoptions");
            } else {
                alert("Failed to create adoption request.");
            }
        } catch (error) {
            console.error("Error creating adoption:", error);
        }
    };

    return (
        <div className="container mt-4 d-flex flex-column gap-3 align-items-start">
            <Link to="/adoptions" className="btn btn-primary">
                ← Back to Adoptions List
            </Link>

            <div className="card p-4 mb-5 shadow-sm w-100">
                <h3>Create Adoption Request</h3>
                <form onSubmit={handleCreate}>
                    <div className="row g-3 mt-1">
                        <div className="col-md-4">
                            <label className="form-label">User</label>
                            <input
                                name="user_id"
                                className="form-control"
                                value={formData.user_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Pet</label>
                            <input
                                name="pet_id"
                                className="form-control"
                                value={formData.pet_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Shelter</label>
                            <input
                                name="shelter_id"
                                className="form-control"
                                value={formData.shelter_id}
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
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">State</label>
                            <select
                                name="state"
                                className="form-select"
                                value={formData.state}
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
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Add optional comments..."
                            ></textarea>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">
                        Submit Adoption Request
                    </button>
                </form>
            </div>
        </div>
    );
};