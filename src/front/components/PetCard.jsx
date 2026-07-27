import React from "react";
import { Link } from "react-router-dom";

export const PetCard = ({ pet, onDelete }) => {
    return (
        <div className="col-md-4">
            <div className="card h-100 shadow-sm">
                {pet.photoUrl && (
                    <img
                        src={pet.photoUrl}
                        className="card-img-top"
                        alt={pet.name}
                        style={{ height: "180px", objectFit: "cover" }}
                    />
                )}
                <div className="card-body">
                    <h5 className="card-title">{pet.name}</h5>
                    <p className="card-text mb-1"><strong>Gender:</strong> {pet.genre}</p>
                    <p className="card-text mb-1"><strong>Size:</strong> {pet.size}</p>
                    <p className="card-text mb-1"><strong>Color:</strong> {pet.color}</p>
                    <p className="card-text mb-1"><strong>Chip Number:</strong> {pet.chipNumber || "No chip"}</p>
                    <p className="card-text mb-1"><strong>Birth Date:</strong> {pet.birthDate || "Unknown"}</p>
                    <p className="card-text mb-1"><strong>Castrated:</strong> {pet.castrated ? "Yes" : "No"}</p>
                </div>
                <div className="card-footer d-flex justify-content-between bg-white border-top-0 pb-3">
                    <Link to={`/pets/${pet.id}`} className="btn btn-warning btn-sm">
                        Edit
                    </Link>
                    {onDelete && (
                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(pet.id)}>
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};