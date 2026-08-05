import React from "react";
import { Link } from "react-router-dom";

export const MedicalAppointmentCard = ({ appointment, users = [], pets = [], veterinarians = [], onDelete, onApprove, onReject }) => {
    const userFound = users.find((u) => String(u.id) === String(appointment.user_id));
    const petFound = pets.find((p) => String(p.id) === String(appointment.pet_id));
    const veterinarianFound = veterinarians.find((s) => String(s.id) === String(appointment.veterinarian_id));

    if (!userFound || !petFound || !veterinarianFound) {
        console.log({
            appointment,
            userFound,
            petFound,
            veterinarianFound
        });

        return (
            <div className="alert alert-danger">
                Error cargando los datos relacionados.
            </div>
        );
    }

    return (
        <div className="col-md-4">
            <div className="card h-100 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        Appointment #{appointment.id}
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
                    <p className="card-text mb-1">
                        <strong>State:</strong> {appointment.state}
                    </p>
                </div>
                <div className="card-footer d-flex justify-content-between bg-white border-top-0 pb-3">
                    <Link to={`/medapps-view/${appointment.id}`} className="btn btn-primary btn-sm">
                        View
                    </Link>
                    <Link to={`/medapps/${appointment.id}`} className="btn btn-warning btn-sm">
                        Edit
                    </Link>
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => onApprove && onApprove(appointment.id)}
                    >
                        Approve
                    </button>

                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onReject && onReject(appointment.id)}
                    >
                        Reject
                    </button>
                    {onDelete && (
                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(appointment.id)}>
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};