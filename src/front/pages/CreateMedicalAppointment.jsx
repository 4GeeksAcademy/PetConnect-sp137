import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const CreateMedicalAppointment = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [appointment, setAppointment] = useState({
        user_id: "",
        pet_id: "",
        shelter_id: "",
        date: "",
        hour: "",
        comments: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...appointment,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData({
            user_id: "",
            pet_id: "",
            shelter_id: "",
            date: "",
            hour: "",
            comments: ""
        });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/medical-appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointment)
            });

            if (response.ok) {
                alert("Medical appointment created successfully!");
                resetForm();
                navigate("/medapps");
            } else {
                alert("Failed to create medical appointment");
            }
        } catch (error) {
            console.error("Error creating medical appointment:", error);
        }
    };

    return (
        <div className="container mt-4 d-flex flex-column gap-3 align-items-start">
            <Link to="/medapps" className="btn btn-primary">
                ← Back to Medical Appointments List
            </Link>

            <div className="card p-4 mb-5 shadow-sm w-100">
                <h3>Create New Medical Appointment</h3>
                <form onSubmit={handleCreate}>
                    <div className="row g-3 mt-1">
                        <div className="col-md-4">
                            <label className="form-label">User</label>
                            <input
                                name="user"
                                className="form-control"
                                value={appointment.user_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Pet</label>
                            <input
                                name="pet"
                                className="form-control"
                                value={appointment.pet_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Shelter</label>
                            <input
                                name="shelter"
                                className="form-control"
                                value={appointment.shelter_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                name="date"
                                className="form-control"
                                value={appointment.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Hour</label>
                            <input
                                type="time"
                                name="hour"
                                className="form-control"
                                value={appointment.hour}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Comments</label>
                            <textarea
                                name="comments"
                                className="form-control"
                                rows="2"
                                value={appointment.comments}
                                onChange={handleChange}
                                placeholder="Appointment comments"
                            ></textarea>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">
                        Create Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};