import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateVeterinarian = () => {

    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);

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

    const API = "/api/veterinarians";

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

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
                setForm((prev) => ({
                    ...prev,
                    iconUrl: data.secure_url
                }));
            }
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            alert("Could not upload the image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                navigate("/veterinarian");
            } else {
                alert("Error creating veterinarian");
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mt-5">

            <h2>New Veterinarian</h2>

            <form onSubmit={handleSubmit}>

                <input
                    className="form-control mb-3"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="pc"
                    placeholder="Postal Code"
                    value={form.pc}
                    onChange={handleChange}
                />

                <div className="mb-3">
                    <label className="form-label">Veterinarian Icon or Image</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={uploading}
                    />
                    {uploading && <small className="text-muted d-block mt-1">Uploading image...</small>}
                    {form.iconUrl && !uploading && (
                        <div className="mt-2">
                            <small className="text-success d-block">Image uploaded successfully</small>
                            <img src={form.iconUrl} alt="Preview" style={{ width: "90px", height: "90px", objectFit: "cover" }} className="mt-1 rounded border" />
                        </div>
                    )}
                </div>

                <input
                    className="form-control mb-3"
                    name="iban"
                    placeholder="IBAN"
                    value={form.iban}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="schedule"
                    placeholder="Schedule"
                    value={form.schedule}
                    onChange={handleChange}
                />

                <button className="btn btn-success" disabled={uploading}>
                    Save
                </button>

            </form>

        </div>
    );
};

export default CreateVeterinarian;