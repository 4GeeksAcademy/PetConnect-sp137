import React, { useState, useEffect } from "react";

export const Pets = () => {
    const [pets, setPets] = useState([]);

    const [formData, setFormData] = useState({
        idUser: 1,
        idShelter: 1,
        idBreed: 1,
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

    const [editingPet, setEditingPet] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchPets = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/pets`);
            if (response.ok) {
                const data = await response.json();
                setPets(data);
            }
        } catch (error) {
            console.error("Error fetching pets:", error);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

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
                resetForm();
                fetchPets();
            }
        } catch (error) {
            console.error("Error creating pet:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pet?")) return;

        try {
            const response = await fetch(`${backendUrl}/api/pets/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchPets();
            }
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    const handleOpenEdit = (pet) => {
        setEditingPet(pet);
        setFormData({
            name: pet.name || "",
            genre: pet.genre || "male",
            birthDate: pet.birthDate || "",
            castrated: pet.castrated || false,
            chipNumber: pet.chipNumber || "",
            color: pet.color || "",
            photoUrl: pet.photoUrl || "",
            size: pet.size || "medium",
            idUser: pet.idUser || "",
            idShelter: pet.idShelter || "",
            idBreed: pet.idBreed || ""
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/pets/${editingPet.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setEditingPet(null);
                resetForm();
                fetchPets();
            }
        } catch (error) {
            console.error("Error updating pet:", error);
        }
    };

    if (editingPet) {
        return (
            <div className="container mt-4">
                <h2>Edit Pet (ID: {editingPet.id})</h2>
                <form onSubmit={handleUpdate} className="card p-4 mt-3 bg-light">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Name *</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Gender</label>
                            <select name="genre" className="form-select" value={formData.genre} onChange={handleChange}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="col-md-3">
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
                            <input type="text" name="photoUrl" className="form-control" value={formData.photoUrl} onChange={handleChange} />
                        </div>

                        <div className="col-md-12 form-check mt-3 ms-2">
                            <input type="checkbox" name="castrated" className="form-check-input" id="editCastrated" checked={formData.castrated} onChange={handleChange} />
                            <label className="form-check-label" htmlFor="editCastrated">Is Castrated?</label>
                        </div>
                    </div>

                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-success">Save Changes</button>
                        <button type="button" className="btn btn-danger" onClick={() => { setEditingPet(null); resetForm(); }}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Pet Management</h1>

            <div className="card p-4 mb-5 shadow-sm">
                <h3>Add New Pet</h3>
                <form onSubmit={handleCreate}>
                    <div className="row g-3 mt-1">
                        <div className="col-md-4">
                            <label className="form-label">Name *</label>
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

                    <button type="submit" className="btn btn-primary mt-3">Register Pet</button>
                </form>
            </div>

            <h3>Pets List in Database</h3>
            {pets.length === 0 ? (
                <p className="text-muted">No pets registered yet.</p>
            ) : (
                <div className="row g-3 mt-2">
                    {pets.map((pet) => (
                        <div key={pet.id} className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                {pet.photoUrl && (
                                    <img src={pet.photoUrl} className="card-img-top" alt={pet.name} style={{ height: "180px", objectFit: "cover" }} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{pet.name}</h5>
                                    <p className="card-text mb-1"><strong>Gender:</strong> {pet.genre}</p>
                                    <p className="card-text mb-1"><strong>Size:</strong> {pet.size}</p>
                                    <p className="card-text mb-1"><strong>Color:</strong> {pet.color}</p>
                                    <p className="card-text mb-1"><strong>Birth Date:</strong> {pet.birthDate || "Not provided"}</p>
                                    <p className="card-text mb-1"><strong>Chip:</strong> {pet.chipNumber || "No chip"}</p>
                                    <p className="card-text mb-1"><strong>Castrated:</strong> {pet.castrated ? "Yes" : "No"}</p>
                                </div>
                                <div className="card-footer d-flex justify-content-between bg-white border-top-0 pb-3">
                                    <button className="btn btn-warning btn-sm" onClick={() => handleOpenEdit(pet)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(pet.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};