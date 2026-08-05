import React from "react";
import { Link } from "react-router-dom";

export const MedicalAppointmentCardAsUser = ({ appointment, users = [], pets = [], veterinarians = [], onDelete }) => {
    const userFound = users.find((u) => String(u.id) === String(appointment.user_id));
    const petFound = pets.find((p) => String(p.id) === String(appointment.pet_id));
    const veterinarianFound = veterinarians.find((s) => String(s.id) === String(appointment.veterinarian_id));

    if (!userFound || !petFound || !veterinarianFound) {
        return null;
    }

    return (
        <div className="col-md-4">
            <div className="card h-100 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        Medical Appointment
                    </h5>
                    <p className="card-text mb-1">
                        <strong>User:</strong> {userFound.name}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Pet:</strong> {petFound.name}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Veterinarian:</strong> {veterinarianFound.name}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Date:</strong> {appointment.date || "N/A"}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Hour:</strong> {appointment.hour || "N/A"}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Comments:</strong> {appointment.comments || "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
};