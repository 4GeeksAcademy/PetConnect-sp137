import React from "react";
import { Link } from "react-router-dom";

export const PetAdoptionCard = ({ pet, distance, onAdoptClick }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
                <img
                    src={pet.photoUrl}
                    className="card-img-top"
                    alt={pet.name}
                    style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{pet.name}</h5>
                    <p className="card-text mb-1"><strong>Breed</strong> {pet.breed?.breedName || "N/A"}</p>
                    <p className="card-text mb-1"><strong>Gender:</strong> {pet.genre}</p>
                    <p className="card-text mb-1"><strong>Size:</strong> {pet.size}</p>
                    <p className="card-text mb-1"><strong>Color:</strong> {pet.color}</p>
                    <p className="card-text mb-1"><strong>Shelter:</strong> {pet.shelter?.name || "Unknown Shelter"}</p>
                    <p className="card-text mb-3 text-muted">
                        <small>📍 Distance: {distance !== null ? `${distance} km away` : "Calculing..."}</small>
                    </p>
                    <Link to="/adopt-as-user" state={{ pet }} className="btn btn-primary btn-sm w-100">
                        Adopt
                    </Link>
                </div>
            </div>
        </div>
    );
};