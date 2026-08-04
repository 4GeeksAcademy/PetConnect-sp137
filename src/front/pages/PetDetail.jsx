import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const PetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [shelters, setShelters] = useState([]);
    const [breeds, setBreeds] = useState([]);

    const [pet, setPet] = useState({
        name: "",
        genre: "male",
        birthDate: "",
        castrated: false,
        chipNumber: "",
        color: "",
        photoUrl: "",
        size: "medium",
        user_id: "",
        shelter_id: "",
        breed_id: ""
    });

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const [resUsers, resShelters, resBreeds, resPet] = await Promise.all([
                    fetch(`${backendUrl}/api/user`),
                    fetch(`${backendUrl}/api/shelter`),
                    fetch(`${backendUrl}/api/breed`),
                    fetch(`${backendUrl}/api/pets/${id}`)
                ]);

                if (resUsers.ok) setUsers(await resUsers.json());
                if (resShelters.ok) setShelters(await resShelters.json());
                if (resBreeds.ok) setBreeds(await resBreeds.json());

                if (resPet.ok) {
                    const data = await resPet.json();
                    const uId = data.user_id || data.idUser || "";
                    const sId = data.shelter_id || data.idShelter || "";
                    const bId = data.breed_id || data.idBreed || "";

                    setPet({
                        ...data,
                        birthDate: data.birthDate || "",
                        chipNumber: data.chipNumber || "",
                        photoUrl: data.photoUrl || "",
                        user_id: uId ? String(uId) : "",
                        shelter_id: sId ? String(sId) : "",
                        breed_id: bId ? String(bId) : ""
                    });
                }
            } catch (error) {
                console.error("Error fetching pet details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
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

        const payload = {
            name: pet.name,
            genre: pet.genre,
            size: pet.size,
            birthDate: pet.birthDate,
            color: pet.color,
            chipNumber: pet.chipNumber,
            photoUrl: pet.photoUrl,
            castrated: pet.castrated,
            user_id: pet.user_id ? Number(pet.user_id) : null,
            shelter_id: pet.shelter_id ? Number(pet.shelter_id) : null,
            breed_id: pet.breed_id ? Number(pet.breed_id) : null
        };

        try {
            const response = await fetch(`${backendUrl}/api/pet-detail/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Pet updated successfully!");
                navigate("/pets");
            } else {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
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

    if (!store.adminUserAuth) {
        return (
            <div className="container mt-4">
                <p>Private Admin</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/pets" className="btn btn-primary mb-3">
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
                            <label className="form-label">Breed</label>
                            <select
                                name="breed_id"
                                className="form-select"
                                value={pet.breed_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a breed</option>
                                {breeds.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.breedName || b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">User</label>
                            <select
                                name="user_id"
                                className="form-select"
                                value={pet.user_id}
                                onChange={handleChange}
                            >
                                <option value="">Select a user</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Shelter</label>
                            <select
                                name="shelter_id"
                                className="form-select"
                                value={pet.shelter_id}
                                onChange={handleChange}
                            >
                                <option value="">Select a shelter</option>
                                {shelters.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
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