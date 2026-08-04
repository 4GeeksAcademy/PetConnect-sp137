import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const CreateMedicalAppointment = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
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
        const fetchDropdownData = async () => {
            try {
                const [resUsers, resPets, resVets] = await Promise.all([
                    fetch(`${backendUrl}/api/user`),
                    fetch(`${backendUrl}/api/pets`),
                    fetch(`${backendUrl}/api/veterinarians`)
                ]);

                if (resUsers.ok) setUsers(await resUsers.json());
                if (resPets.ok) setPets(await resPets.json());
                if (resVets.ok) setVeterinarians(await resVets.json());
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };

        fetchDropdownData();
    }, [backendUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment({
            ...appointment,
            [name]: value
        });
    };

    const resetForm = () => {
        setAppointment({
            user_id: "",
            pet_id: "",
            veterinarian_id: "",
            date: "",
            hour: "",
            comments: ""
        });
    };

    const handleCreate = async (e) => {
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
            const response = await fetch(`${backendUrl}/api/medical-appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Medical appointment created successfully!");
                resetForm();
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

    if (!store.adminUserAuth) {
        return (
            <div className="container mt-4">
                <p>Private Admin</p>
            </div>
        );
    }

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