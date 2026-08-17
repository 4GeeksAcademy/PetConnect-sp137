import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VeterinarianRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        name: "",
        password: "",
        city: "",
        address: "",
        email: "",
        pc: "",
        iconUrl: "",
        iban: "",
        schedule: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Corrección: Debe ser FormData, no Form
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
                setForm((prev) => ({
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
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
            setLoading(false);
            setError("VITE_BACKEND_URL is not defined in .env file");
            return;
        }

        try {
            const response = await fetch(backendUrl + "/api/veterinarians", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error creating user");
            }

            setSuccess(true);
            setForm({
                name: "",
                password: "",
                city: "",
                address: "",
                email: "",
                pc: "",
                iconUrl: "",
                iban: "",
                schedule: ""
            });

            setTimeout(() => {
                navigate("/loginPage");
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container justify-content-center align-items-center py-5 col-md-8 offset-md-2"
            style={{
                minHeight: "100vh",
                background: "#f8f9fa",
            }}>

            <h1>CREATE VETERINARIAN</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Veterinarian registered successfully!</div>}

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label text-muted fw-bold small mb-1 p-3">Name *</label>
                    <input
                        type="text"
                        className="form-control form-control-custom"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Name"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label text-muted fw-bold small mb-1 p-3">Email *</label>
                    <input
                        type="email"
                        className="form-control form-control-custom"
                        id="email"
                        name="email"
                        value={form.email}
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
                        value={form.password}
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
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="address" className="form-label text-muted fw-bold small mb-1 p-3">Address</label>
                    <input
                        type="text"
                        className="form-control form-control-custom"
                        id="address"
                        name="address"
                        value={form.address}
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
                        value={form.pc}
                        onChange={handleChange}
                        placeholder="Postal code"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="iconUrl" className="form-label text-muted fw-bold small mb-1 p-3">User Image</label>
                    <input
                        type="file"
                        className="form-control form-control-custom"
                        id="iconUrl"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={loading || uploading}
                    />
                    {uploading && <small className="text-muted d-block mt-1">Uploading image...</small>}
                    {form.iconUrl && !uploading && (
                        <div className="mt-2">
                            <small className="text-success d-block">Image loaded.</small>
                            <img src={form.iconUrl} alt="Preview" style={{ width: "90px", height: "90px", objectFit: "cover" }} className="mt-1 rounded border" />
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
                        value={form.iban}
                        onChange={handleChange}
                        placeholder="1234 1234 12 0123456789"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="schedule" className="form-label text-muted fw-bold small mb-1 p-3">Schedule</label>
                    <input
                        type="text"
                        className="form-control form-control-custom"
                        id="schedule"
                        name="schedule"
                        value={form.schedule}
                        onChange={handleChange}
                        placeholder="08:00 17:00"
                    />
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-login-submit w-100"
                        style={{ fontWeight: 800 }}
                        disabled={loading || uploading}
                    >
                        {loading ? "Saving..." : "Register Veterinarian"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary w-50 rounded-pill py-2"
                        style={{ fontWeight: 800 }}
                        onClick={() => navigate("/")}
                        disabled={loading || uploading}
                    >
                        Cancel
                    </button>
                </div>
            </form>

        </div>
    );
};

export default VeterinarianRegister;