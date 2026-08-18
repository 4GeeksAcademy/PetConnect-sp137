import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const ShelterDashboardAddPet = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        shelter_id: store.currentShelter?.id,
        name: "",
        genre: "male",
        birthDate: "",
        castrated: false,
        chipNumber: "",
        color: "",
        photoUrl: "",
        size: "medium"
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const resetForm = () => {
        setFormData({
            shelter_id: store.currentShelter?.id,
            name: "",
            genre: "male",
            birthDate: "",
            castrated: false,
            chipNumber: "",
            color: "",
            photoUrl: "",
            size: "medium"
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
                navigate("/shelterDashboard");
            } else {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
                alert("Failed to register pet");
            }
        } catch (error) {
            console.error("Error creating pet:", error);
        }
    };

    if (!store.shelterAuth) {
        return (
            <div className="container mt-4">
                <p>Private area for Shelters</p>
            </div>
        );
    }
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", "petconnect");

        setUploading(true);
        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/ojckqgp2/image/upload",
                {
                    method: "POST",
                    body: uploadData,
                }
            );

            const data = await response.json();
            if (data.secure_url) {
                setFormData(prev => ({
                    ...prev,
                    photoUrl: data.secure_url
                }));
                alert("Image uploaded successfully!");
            }
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            alert("Could not upload the image.");
        } finally {
            setUploading(false);
        }
    };
    return (
        <div className="container mt-4 d-flex flex-column gap-3 align-items-start">
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
                            <label className="form-label">Pet Photo</label>
                            {formData.photoUrl && (
                                <div className="mb-2">
                                    <img
                                        src={formData.photoUrl}
                                        alt="Pet Preview"
                                        className="rounded shadow-sm"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            {uploading && <small className="text-muted d-block mt-1">Uploading image...</small>}
                        </div>
                        <div className="col-md-12 form-check mt-3 ms-2">
                            <input type="checkbox" name="castrated" className="form-check-input" id="createCastrated" checked={formData.castrated} onChange={handleChange} />
                            <label className="form-check-label" htmlFor="createCastrated">Is Castrated?</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Register Pet</button>
                    <button
                        type="button"
                        className="btn btn-secondary mt-4 ms-2"
                        onClick={() => navigate("/shelterDashboard")}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ShelterDashboardAddPet;