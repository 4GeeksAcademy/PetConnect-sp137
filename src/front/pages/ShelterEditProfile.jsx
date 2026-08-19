import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const ShelterEditProfile = () => {
    const { store } = useGlobalReducer();
    const params = useParams();
    const navigate = useNavigate();

    const parseStoredShelter = () => {
        try {
            return JSON.parse(localStorage.getItem("shelter") || "null");
        } catch {
            return null;
        }
    };

    const currentShelter = store.currentShelter || parseStoredShelter();
    const shelterId = currentShelter?.id;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        city: "",
        cif: "",
        address: "",
        pc: "",
        latitude: "",
        longitude: "",
        iconUrl: "",
        iban: ""
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const API = import.meta.env.VITE_BACKEND_URL + "/api/shelter";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", "petconnect");

        setUploading(true);
        setError(null);
        try {
            const response = window.fetch(
                "https://api.cloudinary.com/v1_1/ojckqgp2/image/upload",
                {
                    method: "POST",
                    body: uploadData,
                }
            );

            const data = await (await response).json();
            if (data.secure_url) {
                const newIconUrl = data.secure_url;

                setFormData((prev) => ({
                    ...prev,
                    icon_url: newIconUrl
                }));

                const payload = {
                    ...formData,
                    icon_url: newIconUrl,
                    latitude: formData.latitude !== "" ? parseFloat(formData.latitude) : null,
                    longitude: formData.longitude !== "" ? parseFloat(formData.longitude) : null
                };

                const updateResponse = await fetch(`${API}/${shelterId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!updateResponse.ok) {
                    const errData = await updateResponse.json();
                    console.error("Failed to update iconUrl in database:", errData);
                    setError(errData.error || "Failed to update image in database.");
                }
            }
        } catch (err) {
            console.error("Error uploading image to Cloudinary:", err);
            setError("Could not upload the image.");
        } finally {
            setUploading(false);
        }
    };

    const getShelter = useCallback(async () => {
        if (!shelterId) return;
        setLoading(true);
        try {
            const response = await fetch(`${API}/${shelterId}`);
            if (!response.ok) throw new Error("No se pudo cargar la información del refugio.");

            const data = await response.json();

            setFormData({
                name: data.name || "",
                email: data.email || "",
                password: "",
                city: data.city || "",
                cif: data.cif || "",
                address: data.address || "",
                pc: data.pc || "",
                latitude: data.latitude ?? "",
                longitude: data.longitude ?? "",
                iconUrl: data.iconUrl || "",
                iban: data.iban || ""
            });
        } catch (err) {
            console.error(err);
            setError("Error al obtener los datos del refugio");
        } finally {
            setLoading(false);
        }
    }, [shelterId, API]);

    useEffect(() => {
        if (!shelterId) {
            navigate("/shelterLogin");
            return;
        }

        if (currentShelter && String(currentShelter.id) === String(shelterId)) {
            setFormData({
                name: currentShelter.name || "",
                email: currentShelter.email || "",
                password: "",
                city: currentShelter.city || "",
                cif: currentShelter.cif || "",
                address: currentShelter.address || "",
                pc: currentShelter.pc || "",
                latitude: currentShelter.latitude ?? "",
                longitude: currentShelter.longitude ?? "",
                iconUrl: currentShelter.iconUrl || "",
                iban: currentShelter.iban || ""
            });
        } else {
            getShelter();
        }
    }, [shelterId, navigate, getShelter]);

    const updateShelter = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            setError("Por favor completa los campos obligatorios (*)");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        const payload = {
            ...formData,
            latitude: formData.latitude !== "" ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude !== "" ? parseFloat(formData.longitude) : null
        };

        try {
            const response = await fetch(`${API}/${shelterId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al actualizar el refugio");
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                navigate(`/ShelterDashboard`);
            }, 1000);

        } catch (err) {
            console.error(err);
            setError(err.message || "Error al actualizar el refugio");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateShelter();
    };

    if (loading && !formData.name) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2 className="mb-4">Edit Profile</h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" role="alert">
                            ¡Shelter updated successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email *</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Déjala en blanco para mantener la actual"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="city" className="form-label">City</label>
                            <input
                                type="text"
                                className="form-control"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cif" className="form-label">CIF</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cif"
                                name="cif"
                                value={formData.cif}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="pc" className="form-label">Postal Code</label>
                            <input
                                type="text"
                                className="form-control"
                                id="pc"
                                name="pc"
                                value={formData.pc}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="latitude" className="form-label">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                className="form-control"
                                id="latitude"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="longitude" className="form-label">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                className="form-control"
                                id="longitude"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="iconUrl" className="form-label">Shelter Icon</label>
                            {formData.icon_url && (
                                <div className="mb-2">
                                    <img
                                        src={formData.icon_url}
                                        alt="Shelter Icon Preview"
                                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                className="form-control"
                                id="icon_url"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            {uploading && <small className="text-muted d-block mt-1">Uploading image...</small>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="iban" className="form-label">IBAN</label>
                            <input
                                type="text"
                                className="form-control"
                                id="iban"
                                name="iban"
                                value={formData.iban}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-warning me-2"
                                disabled={loading || uploading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/shelterDashboard")}
                                disabled={loading || uploading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShelterEditProfile;