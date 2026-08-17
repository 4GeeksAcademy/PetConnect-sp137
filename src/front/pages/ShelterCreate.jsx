import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

export const ShelterCreate = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        city: "",
        cif: "",
        address: "",
        pc: "",
        iconUrl: "",
        latitude: "",
        longitude: "",
        iban: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", "petconnect");

        setUploading(true);
        setError(null);
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
                setFormData((prev) => ({
                    ...prev,
                    iconUrl: data.secure_url
                }));
            } else {
                throw new Error(data.error?.message || "Error uploading image");
            }
        } catch (err) {
            console.error("Error uploading image to Cloudinary:", err);
            setError("Could not upload the image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

            console.log("Enviando datos a:", backendUrl + "/api/shelter")
            console.log("Datos del formulario:", formData)

            const payload = {
                ...formData,
                latitude: formData.latitude !== "" ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude !== "" ? parseFloat(formData.longitude) : null
            };

            const response = await fetch(backendUrl + "/api/shelter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el refugio")
            }

            setSuccess(true)
            setFormData({
                name: "",
                email: "",
                password: "",
                city: "",
                cif: "",
                address: "",
                pc: "",
                iconUrl: "",
                latitude: "",
                longitude: "",
                iban: ""
            })

            setTimeout(() => {
                navigate("/loginPage")
            }, 2000)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container justify-content-center align-items-center py-5"
            style={{
                minHeight: "100vh",
                background: "#f8f9fa",
            }}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
 
                    <h1>
                        Registrar Refugio
                    </h1>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" role="alert">
                            Shelter created successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label text-muted fw-bold small mb-1 p-3">Name *</label>
                            <input
                                type="text"
                                className="form-control form-control-custom"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Shelter name"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label text-muted fw-bold small mb-1 p-3">Email *</label>
                            <input
                                type="email"
                                className="form-control form-control-custom"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="email@example.com"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label text-muted fw-bold small mb-1 p-3">Password *</label>
                            <input
                                type="password"
                                className="form-control form-control-custom"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Password"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="city" className="form-label text-muted fw-bold small mb-1 p-3">City</label>
                            <input
                                type="text"
                                className="form-control form-control-custom"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cif" className="form-label text-muted fw-bold small mb-1 p-3">CIF</label>
                            <input
                                type="text"
                                className="form-control form-control-custom"
                                id="cif"
                                name="cif"
                                value={formData.cif}
                                onChange={handleChange}
                                placeholder="Shelter CIF"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label text-muted fw-bold small mb-1 p-3">Address</label>
                            <input
                                type="text"
                                className="form-control form-control-custom"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Full address"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="pc" className="form-label text-muted fw-bold small mb-1 p-3">Postal Code</label>
                            <input
                                type="text"
                                className="form-control form-control-custom"
                                id="pc"
                                name="pc"
                                value={formData.pc}
                                onChange={handleChange}
                                placeholder="Postal code"
                            />
                        </div>

                     <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="latitude" className="form-label text-muted fw-bold small mb-1 p-3">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                className="form-control form-control-custom"
                                id="latitude"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                placeholder="e.g. 41.3879"
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="longitude" className="form-label text-muted fw-bold small mb-1 p-3">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                className="form-control form-control-custom"
                                id="longitude"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                placeholder="e.g. 2.1699"
                            />
                        </div>
                    </div>


                        <div className="mb-3">
                            <label htmlFor="iconUrl" className="form-label text-muted fw-bold small mb-1 p-3">Shelter Image</label>
                            <input
                                type="file"
                                className="form-control form-control-custom"
                                id="iconUrl"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={loading || uploading}
                            />
                            {uploading && <small className="text-muted d-block mt-1">Uploading image...</small>}
                            {formData.iconUrl && !uploading && (
                                <div className="mt-2">
                                    <small className="text-success d-block">Image loaded.</small>
                                    <img src={formData.iconUrl} alt="Preview" style={{ width: "90px", height: "90px", objectFit: "cover" }} className="mt-1 rounded border" />
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="iban" className="form-label text-muted fw-bold small mb-1 p-3">IBAN</label>
                            <input
                                type="text"
                                className="form-control form-control-custom"
                                id="iban"
                                name="iban"
                                value={formData.iban}
                                onChange={handleChange}
                                placeholder="IBAN"
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-login-submit w-100"
                                style={{ fontWeight: 800 }}
                                disabled={loading || uploading}
                            >
                                {loading ? "Saving..." : "Register Shelter"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary w-50 rounded-pill py-2"
                                style={{ fontWeight: 800 }}
                                onClick={() => navigate("/")}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}