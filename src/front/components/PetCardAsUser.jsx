import React from "react";

export const PetCardAsUser = ({ pet, users = [], shelters = [], breeds = [], onEdit, onDelete }) => {
    const ownerUser = users.find(u => u.id === pet.user_id || u.id === pet.userId);
    const ownerShelter = shelters.find(s => s.id === pet.shelter_id || s.id === pet.shelterId);
    const petBreed = breeds.find(b => b.id === pet.breed_id || b.id === pet.breedId);

    const petPhoto = pet.photo_url || pet.photoUrl;
    const birthDate = pet.birth_date || pet.birthDate;
    const chipNumber = pet.chip_number || pet.chipNumber;

    return (
        <div className="card shadow-sm" style={{ maxWidth: "350px", borderRadius: "15px" }}>
            <div className="row g-3 align-items-center">
                <div className="text-center">
                    {petPhoto ? (
                        <img
                            src={petPhoto}
                            className="img-fluid rounded"
                            alt={pet.name}
                            style={{ height: "150px", width: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <div className="bg-light text-muted d-flex align-items-center justify-content-center rounded mx-auto" style={{ height: "110px", width: "110px" }}>
                            <small>No Photo</small>
                        </div>
                    )}
                </div>
                <div className="col-8 ps-3">
                    <h5 className="card-title mb-2 text-primary">{pet.name}</h5>
                    <p className="card-text mb-1 small"><strong>Breed:</strong> {petBreed ? (petBreed.breedName || petBreed.name) : "N/A"}</p>
                    <p className="card-text mb-1 small"><strong>Birth Date:</strong> {birthDate || "N/A"}</p>
                    <p className="card-text mb-1 small"><strong>Chip:</strong> {chipNumber || "N/A"}</p>
                    <p className="card-text mb-1 small"><strong>Gender:</strong> {pet.genre}</p>
                    <p className="card-text mb-1 small"><strong>Color:</strong> {pet.color}</p>
                    <p className="card-text mb-1 small"><strong>Size:</strong> {pet.size}</p>
                    <p className="card-text mb-2 small"><strong>Castrated:</strong> {pet.castrated ? "Yes" : "No"}</p>
                </div>
            </div>
            <div className="d-flex justify-content-center gap-2 mb-2">
                <button className="btn btn-sm btn-primary px-3" onClick={() => onEdit(pet.id)}>
                    Edit
                </button>
                <button className="btn btn-sm btn-danger px-3" onClick={() => onDelete(pet.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
};