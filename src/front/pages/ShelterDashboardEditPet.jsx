import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ShelterDashboardEditPet = () => {
    const { store } = useGlobalReducer();
    const params = useParams();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        genre: "",
        color: "",
        size: "",
        birthDate: "",
        chipNumber: "",
        castrated: false,
        photoUrl: "",
        user_id: "",
        shelter_id: "",
        breed_id: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL + "/api/pets";
    const UPDATE_API = import.meta.env.VITE_BACKEND_URL + "/api/pet-detail";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const petId = params.id || store.currentPet?.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updatePet();
    };

    const getPet = async () => {
        if (!petId) return;
        try {
            const response = await fetch(`${API}/${petId}`);
            const data = await response.json();

            setFormData({
                name: data.name || "",
                genre: data.genre || "",
                color: data.color || "",
                size: data.size || "",
                birthDate: data.birthDate || "",
                chipNumber: data.chipNumber || "",
                castrated: Boolean(data.castrated),
                photoUrl: data.photoUrl || "",
                user_id: data.user_id || "",
                shelter_id: data.shelter_id || "",
                breed_id: data.breed_id || ""
            });
        } catch (error) {
            console.log(error);
        }
    };

    const updatePet = async () => {
        if (!formData.name.trim()) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${UPDATE_API}/${petId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    birthDate: formData.birthDate || null,
                    chipNumber: formData.chipNumber || null,
                    photoUrl: formData.photoUrl || null,
                    user_id: formData.user_id || "",
                    shelter_id: formData.shelter_id || "",
                    breed_id: formData.breed_id || "",
                    castrated: Boolean(formData.castrated)
                })
            });

            const contentType = response.headers.get("content-type") || "";
            const data = contentType.includes("application/json")
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                setError(typeof data === "string" ? data : data.error || "Error al actualizar la mascota");
                setLoading(false);
                return;
            }

            setSuccess(true);
            navigate("/shelterDashboard");
        } catch (error) {
            console.log(error);
            setError(error.message || "Error al actualizar la mascota");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!petId) {
            navigate("/shelterLogin");
            return;
        }

        if (store.currentPet && String(store.currentPet.id) === String(petId)) {
            setFormData({
                name: store.currentPet.name || "",
                genre: store.currentPet.genre || "",
                color: store.currentPet.color || "",
                size: store.currentPet.size || "",
                birthDate: store.currentPet.birthDate || "",
                chipNumber: store.currentPet.chipNumber || "",
                castrated: Boolean(store.currentPet.castrated),
                photoUrl: store.currentPet.photoUrl || ""
            });
        }
        getPet();
    }, [petId, navigate, store.currentPet]);

    if (!store.shelterAuth) {
        return (
            <div className="container mt-4">
                <p>Private Shelter</p>
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
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2 className="mb-4">Editar mascota</h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" role="alert">
                            ¡Mascota actualizada exitosamente!
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nombre *</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Nombre de la mascota"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="genre" className="form-label">Género</label>
                            <input
                                type="text"
                                className="form-control"
                                id="genre"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                placeholder="male/female"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="color" className="form-label">Color</label>
                            <input
                                type="text"
                                className="form-control"
                                id="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder="Color"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="size" className="form-label">Tamaño</label>
                            <input
                                type="text"
                                className="form-control"
                                id="size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="small/medium/large"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="birthDate" className="form-label">Fecha de nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="chipNumber" className="form-label">Chip</label>
                            <input
                                type="text"
                                className="form-control"
                                id="chipNumber"
                                name="chipNumber"
                                value={formData.chipNumber}
                                onChange={handleChange}
                                placeholder="Número de chip"
                            />
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

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="castrated"
                                name="castrated"
                                checked={formData.castrated}
                                onChange={(e) => setFormData((prev) => ({ ...prev, castrated: e.target.checked }))}
                            />
                            <label className="form-check-label" htmlFor="castrated">Castrado</label>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-warning me-2"
                                onClick={updatePet}>
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/shelterDashboardViewPets")}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}



