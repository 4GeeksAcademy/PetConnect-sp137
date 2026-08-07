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
        uploadData.append("upload_preset", "TU_UPLOAD_PRESET");

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

        const backendUrl = import.meta.env.VITE_BACKEND_URL

        if (!backendUrl) {
            setLoading(false);
            throw new Error("VITE_BACKEND_URL is not defined in .env file")
        }

        try {
            const response = await fetch(backendUrl + "/api/shelter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Error creating shelter")
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
                iban: ""
            })

            setTimeout(() => {
                navigate("/")
            }, 2000)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2 className="mb-4">Create Shelter</h2>

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
                            <label htmlFor="name" className="form-label">Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Shelter name"
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
                                placeholder="email@example.com"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password *</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Password"
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
                                placeholder="City"
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
                                placeholder="Shelter CIF"
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
                                placeholder="Full address"
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
                                placeholder="Postal code"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="iconUrl" className="form-label">Shelter Image</label>
                            <input
                                type="file"
                                className="form-control"
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
                            <label htmlFor="iban" className="form-label">IBAN</label>
                            <input
                                type="text"
                                className="form-control"
                                id="iban"
                                name="iban"
                                value={formData.iban}
                                onChange={handleChange}
                                placeholder="IBAN for donations"
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || uploading}
                            >
                                {loading ? "Saving..." : "Save Shelter"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/shelter")}
                                disabled={loading || uploading}
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