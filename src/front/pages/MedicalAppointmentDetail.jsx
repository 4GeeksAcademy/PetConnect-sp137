import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const MedicalAppointmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [pets, setPets] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);

    const [appointment, setAppointment] = useState({
        user_id: "",
        pet_id: "",
        veterinarian_id: "",
        date: "",
        hour: "",
        comments: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resAppt, resUsers, resPets, resVets] = await Promise.all([
                    fetch(`${backendUrl}/api/medical-appointments/${id}`),
                    fetch(`${backendUrl}/api/user`),
                    fetch(`${backendUrl}/api/pets`),
                    fetch(`${backendUrl}/api/veterinarians`)
                ]);

                if (resUsers.ok) setUsers(await resUsers.json());
                if (resPets.ok) setPets(await resPets.json());
                if (resVets.ok) setVeterinarians(await resVets.json());

                if (resAppt.ok) {
                    const data = await resAppt.json();
                    setAppointment({
                        user_id: data.user_id || data.idUser || "",
                        pet_id: data.pet_id || data.idPet || "",
                        veterinarian_id: data.veterinarian_id || data.idVeterinarian || "",
                        date: data.date || "",
                        hour: data.hour || "",
                        comments: data.comments || ""
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
            user_id: appointment.user_id ? Number(appointment.user_id) : null,
            idUser: appointment.user_id ? Number(appointment.user_id) : null,
            pet_id: appointment.pet_id ? Number(appointment.pet_id) : null,
            idPet: appointment.pet_id ? Number(appointment.pet_id) : null,
            veterinarian_id: appointment.veterinarian_id ? Number(appointment.veterinarian_id) : null,
            idVeterinarian: appointment.veterinarian_id ? Number(appointment.veterinarian_id) : null,
            date: appointment.date,
            hour: appointment.hour,
            comments: appointment.comments
        };

        try {
            const response = await fetch(`${backendUrl}/api/medical-appointments/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Medical appointment updated successfully!");
                navigate("/medapps");
            } else {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
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
                            <select
                                name="user_id"
                                className="form-select"
                                value={appointment.user_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a user</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
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
                                {pets.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Veterinarian</label>
                            <select
                                name="veterinarian_id"
                                className="form-select"
                                value={appointment.veterinarian_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a veterinarian</option>
                                {veterinarians.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
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