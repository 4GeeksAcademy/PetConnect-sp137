import React from "react";
import { Link } from "react-router-dom";

export const AdoptionCard = ({ adoption, onDelete }) => {
    const getStatusBadgeClass = (state) => {
        switch (state?.toLowerCase()) {
            case "sent":
                return "bg-primary";
            case "paid":
                return "bg-success";
            case "rejected":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    return (
        <div className="col-md-4">
            <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                    <h5 className="card-title mb-0">Adoption #{adoption.id}</h5>
                    <span className={`badge ${getStatusBadgeClass(adoption.state)}`}>
                        {adoption.state}
                    </span>
                </div>
                <div className="card-body">
                    <p className="card-text mb-1"><strong>User</strong> {adoption.idUser}</p>
                    <p className="card-text mb-1"><strong>Pet</strong> {adoption.idPet}</p>
                    <p className="card-text mb-1"><strong>Shelter</strong> {adoption.idShelter}</p>
                    <p className="card-text mb-1"><strong>Date</strong> {adoption.date || "N/A"}</p>
                    <p className="card-text mb-1">
                        <strong>Comment:</strong> {adoption.comment || "No comments"}
                    </p>
                </div>
                <div className="card-footer d-flex justify-content-between bg-white border-top-0 pb-3">
                    <Link to={`/adoptions/${adoption.id}`} className="btn btn-warning btn-sm">
                        Edit
                    </Link>
                    {onDelete && (
                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(adoption.id)}>
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};