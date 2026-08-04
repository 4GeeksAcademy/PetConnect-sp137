import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export const MedicalAppointmentView = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
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

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading medical appointment details...</p>
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
            <Link to="/medapps" className="btn btn-outline-secondary mb-3">
                ← Back to Medical Appointments List
            </Link>

            <div className="card shadow-sm p-4">
                <h2 className="mb-4">View Medical Appointment</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">User</label>
                            <select
                                name="user_id"
                                className="form-select"
                                value={appointment.user_id}
                                disabled
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
                                disabled
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
                                disabled
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
                                disabled
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">Hour</label>
                            <input
                                type="time"
                                name="hour"
                                className="form-control"
                                value={appointment.hour}
                                disabled
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">Comments</label>
                            <textarea
                                name="comments"
                                className="form-control"
                                rows="2"
                                value={appointment.comments}
                                disabled
                            ></textarea>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};