import React from "react";
import { Link } from "react-router-dom";

export const AdoptionCard = ({ adoption, users = [], pets = [], shelters = [], onDelete }) => {
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

    const userFound = users.find((u) => String(u.id) === String(adoption.user_id));
    const petFound = pets.find((p) => String(p.id) === String(adoption.pet_id));
    const shelterFound = shelters.find((s) => String(s.id) === String(adoption.shelter_id));

    if (!userFound || !petFound || !shelterFound) {
        return null;
    }

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
                    <p className="card-text mb-1">
                        <strong>User:</strong> {userFound.name}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Pet:</strong> {petFound.name}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Shelter:</strong> {shelterFound.name}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Date:</strong> {adoption.date}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Comment:</strong> {adoption.comment}
                    </p>
                </div>
                <div className="card-footer d-flex justify-content-between bg-white border-top-0 pb-3">
                    <Link to={`/adoption-view/${adoption.id}`} className="btn btn-primary btn-sm">
                        View
                    </Link>
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