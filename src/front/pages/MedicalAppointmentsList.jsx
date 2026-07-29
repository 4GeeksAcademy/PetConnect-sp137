import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MedicalAppointmentCard } from "../components/MedicalAppointmentCard";

export const MedicalAppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/medical-appointments`);
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Error fetching medical appointments:", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this medical appointment?")) return;

        try {
            const response = await fetch(`${backendUrl}/api/medical-appointments/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchAppointments();
            }
        } catch (error) {
            console.error("Error deleting medical appointment:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Medical Appointments List</h1>
                <Link to="/create-medical-appointment" className="btn btn-primary">
                    + Create Appointment
                </Link>
            </div>

            {appointments.length === 0 ? (
                <p className="text-muted">No medical appointments registered yet.</p>
            ) : (
                <div className="row g-3">
                    {appointments.map((appointment) => (
                        <MedicalAppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};