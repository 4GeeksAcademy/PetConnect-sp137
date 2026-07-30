import React from "react";
import { Link } from "react-router-dom";

export const MedicalAppointmentCard = ({ appointment, onDelete }) => {
    return (
        <div className="col-md-4">
            <div className="card h-100 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        Appointment #{appointment.id}
                    </h5>
                    <p className="card-text mb-1">
                        <strong>User</strong> {appointment.user_id}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Pet</strong> {appointment.pet_id}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Shelter</strong> {appointment.shelter_id}
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
                <div className="card-footer d-flex justify-content-between bg-white border-top-0 pb-3">
                    <Link to={`/medical-appointments/${appointment.id}`} className="btn btn-warning btn-sm">
                        Edit
                    </Link>
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