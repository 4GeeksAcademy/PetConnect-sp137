import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const MedicalAppointmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState({
        user_id: "",
        pet_id: "",
        shelter_id: "",
        date: "",
        hour: "",
        comments: ""
    });

    useEffect(() => {
        const fetchAppointmentDetail = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/medical-appointments/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAppointment({
                        user_id: data.user_id,
                        pet_id: data.pet_id,
                        shelter_id: data.shelter_id,
                        date: data.date,
                        hour: data.hour,
                        comments: data.comments
                    });
                }
            } catch (error) {
                console.error("Error fetching medical appointment details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetail();
    }, [id, backendUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment({
            ...appointment,
            [name]: value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/medical-appointments/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointment)
            });

            if (response.ok) {
                alert("Medical appointment updated successfully!");
                navigate("/medapps");
            } else {
                alert("Failed to update medical appointment");
            }
        } catch (error) {
            console.error("Error updating medical appointment:", error);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading medical appointment details...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/medapps" className="btn btn-outline-secondary mb-3">
                ← Back to Medical Appointments List
            </Link>

            <div className="card shadow-sm p-4">
                <h2 className="mb-4">Edit Medical Appointment</h2>

                <form onSubmit={handleSave}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">User</label>
                            <input
                                name="idUser"
                                className="form-control"
                                value={appointment.user_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Pet</label>
                            <input
                                name="idPet"
                                className="form-control"
                                value={appointment.pet_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Shelter</label>
                            <input
                                name="idShelter"
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
                                name="diagnosis"
                                className="form-control"
                                rows="2"
                                value={appointment.comments}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                            Save Changes
                        </button>
                        <Link to="/medapps" className="btn btn-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};