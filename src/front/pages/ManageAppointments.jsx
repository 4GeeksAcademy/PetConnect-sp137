import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MedicalAppointmentCard } from "../components/MedicalAppointmentCard";

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [pets, setPets] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/veterinarian/appointments`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("veterinariantoken")}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Error fetching medical appointments:", error);
        }
    };

    const fetchRelatedData = async () => {
        try {
            const [resUsers, resPets, resVeterinarians] = await Promise.all([
                fetch(`${backendUrl}/api/user`),
                fetch(`${backendUrl}/api/pets`),
                fetch(`${backendUrl}/api/veterinarians`)
            ]);

            if (resUsers.ok) setUsers(await resUsers.json());
            if (resPets.ok) setPets(await resPets.json());
            if (resVeterinarians.ok) setVeterinarians(await resVeterinarians.json());
        } catch (error) {
            console.error("Error fetching related data:", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchRelatedData();
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mis Citas</h1>
            </div>

            {appointments.length === 0 ? (
                <p className="text-muted">No tienes citas programadas.</p>
            ) : (
                <div className="row g-3">
                    {appointments.map((appointment) => (
                        <MedicalAppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            users={users}
                            pets={pets}
                            veterinarians={veterinarians}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageAppointments;