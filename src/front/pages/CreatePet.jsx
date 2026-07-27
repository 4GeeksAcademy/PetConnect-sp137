import React, { useState } from "react";
import { Link } from "react-router-dom";

export const CreatePet = () => {
    const [formData, setFormData] = useState({
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

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const resetForm = () => {
        setFormData({
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
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/pets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Pet registered successfully!");
                resetForm();
            }
        } catch (error) {
            console.error("Error creating pet:", error);
        }
    };

    return (
        <div className="container mt-4 d-flex flex-column gap-3 align-items-start">
            <Link to="/pets" className="btn btn-primary">
                ← Back to Pets List
            </Link>

            <div className="card p-4 mb-5 shadow-sm w-100">
                <h3>Add New Pet</h3>
                <form onSubmit={handleCreate}>
                    <div className="row g-3 mt-1">
                        <div className="col-md-4">
                            <label className="form-label">Name</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Gender</label>
                            <select name="genre" className="form-select" value={formData.genre} onChange={handleChange}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Size</label>
                            <select name="size" className="form-select" value={formData.size} onChange={handleChange}>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Birth Date</label>
                            <input type="date" name="birthDate" className="form-control" value={formData.birthDate} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Color</label>
                            <input type="text" name="color" className="form-control" value={formData.color} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Chip Number</label>
                            <input type="text" name="chipNumber" className="form-control" value={formData.chipNumber} onChange={handleChange} />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Photo URL</label>
                            <input type="text" name="photoUrl" className="form-control" value={formData.photoUrl} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
                        </div>
                        <div className="col-md-12 form-check mt-3 ms-2">
                            <input type="checkbox" name="castrated" className="form-check-input" id="createCastrated" checked={formData.castrated} onChange={handleChange} />
                            <label className="form-check-label" htmlFor="createCastrated">Is Castrated?</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Register Pet</button>
                </form>
            </div>
        </div>
    );
};