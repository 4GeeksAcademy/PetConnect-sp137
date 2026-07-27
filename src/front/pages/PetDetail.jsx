import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const PetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(true);
    const [pet, setPet] = useState({
        name: "",
        genre: "male",
        birthDate: "",
        castrated: false,
        chipNumber: "",
        color: "",
        photoUrl: "",
        size: "medium",
        idUser: "",
        idShelter: "",
        idBreed: ""
    });

    useEffect(() => {
        const fetchPetDetail = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/pets/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPet({
                        ...data,
                        birthDate: data.birthDate || "",
                        chipNumber: data.chipNumber || "",
                        photoUrl: data.photoUrl || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching pet details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPetDetail();
    }, [id, backendUrl]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPet({
            ...pet,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/pets/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pet)
            });

            if (response.ok) {
                alert("Pet updated successfully!");
                navigate("/pets");
            } else {
                alert("Failed to update pet");
            }
        } catch (error) {
            console.error("Error updating pet:", error);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading pet details...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/pets" className="btn btn-outline-secondary mb-3">
                ← Back to Pets List
            </Link>

            <div className="card shadow-sm p-4">
                <h2 className="mb-4">Edit Pet</h2>

                <form onSubmit={handleSave}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={pet.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Gender</label>
                            <select
                                name="genre"
                                className="form-select"
                                value={pet.genre}
                                onChange={handleChange}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Size</label>
                            <select
                                name="size"
                                className="form-select"
                                value={pet.size}
                                onChange={handleChange}
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Birth Date</label>
                            <input
                                type="date"
                                name="birthDate"
                                className="form-control"
                                value={pet.birthDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Color</label>
                            <input
                                type="text"
                                name="color"
                                className="form-control"
                                value={pet.color}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Chip Number</label>
                            <input
                                type="text"
                                name="chipNumber"
                                className="form-control"
                                value={pet.chipNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Photo URL</label>
                            <input
                                type="text"
                                name="photoUrl"
                                className="form-control"
                                value={pet.photoUrl}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-12 form-check mt-3 ms-2">
                            <input
                                type="checkbox"
                                name="castrated"
                                className="form-check-input"
                                id="editCastrated"
                                checked={pet.castrated}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="editCastrated">
                                Is Castrated?
                            </label>
                        </div>
                    </div>

                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                            Save Changes
                        </button>
                        <Link to="/pets" className="btn btn-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};