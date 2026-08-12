import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const MedicalAppointmentCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();

    const currentUserId = store.user?.id || store.currentUser?.id || "";
    const veterinarianIdFromState = location.state?.veterinarianId || "";

    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);

    const [appointment, setAppointment] = useState({
        user_id: currentUserId,
        pet_id: "",
        veterinarian_id: veterinarianIdFromState,
        date: "",
        hour: "",
        comments: "",
        state: "scheduled"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resPets, resVets] = await Promise.all([
                    fetch(`${backendUrl}/api/pets`),
                    fetch(`${backendUrl}/api/veterinarians`)
                ]);

                if (resPets.ok) setPets(await resPets.json());
                if (resVets.ok) setVeterinarians(await resVets.json());
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [backendUrl]);

    const userPets = pets.filter(p => Number(p.user_id) === Number(currentUserId));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment({
            ...appointment,
            [name]: value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const payload = {
            user_id: currentUserId ? Number(currentUserId) : null,
            pet_id: appointment.pet_id ? Number(appointment.pet_id) : null,
            veterinarian_id: appointment.veterinarian_id ? Number(appointment.veterinarian_id) : null,
            date: appointment.date,
            hour: appointment.hour,
            comments: appointment.comments,
            state: "scheduled"
        };

        try {
            const response = await fetch(`${backendUrl}/api/medical-appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Medical appointment created successfully!");
                navigate("/medapps");
            } else {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
                alert("Failed to create medical appointment");
            }
        } catch (error) {
            console.error("Error creating medical appointment:", error);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading creation form...</p>
            </div>
        );
    }

    const selectedVet = veterinarians.find(v => Number(v.id) === Number(appointment.veterinarian_id));

    return (
        <div className="container mt-4">
            <Link to="/veterinariansView" className="btn btn-outline-secondary mb-3">
                ← Back
            </Link>

            <div className="card shadow-sm p-4">
                <h2 className="mb-4">Book Medical Appointment</h2>

                <form onSubmit={handleSave}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">User</label>
                            <input
                                type="text"
                                className="form-control"
                                value={store.user?.name || store.currentUser?.name || "Current User"}
                                disabled
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Pet</label>
                            <select
                                name="pet_id"
                                className="form-select"
                                value={appointment.pet_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a pet</option>
                                {userPets.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Veterinarian</label>
                            <input
                                type="text"
                                className="form-control"
                                value={selectedVet ? selectedVet.name : appointment.veterinarian_id}
                                disabled
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
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">Comments</label>
                            <textarea
                                name="comments"
                                className="form-control"
                                rows="2"
                                value={appointment.comments}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                            Book Appointment
                        </button>
                        <Link to="/dashboard-user" className="btn btn-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};