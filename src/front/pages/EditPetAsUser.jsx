import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const EditPetAsUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [shelters, setShelters] = useState([]);
    const [breeds, setBreeds] = useState([]);

    const currentUserId = store.currentUser?.id || JSON.parse(localStorage.getItem("user"))?.id;
    const userToken = store.userAuth || localStorage.getItem("userToken");

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
        if (!userToken) {
            navigate("/userLogin");
            return;
        }

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
                    
                    const uId = data.user_id || "";
                    if (currentUserId && Number(uId) !== Number(currentUserId)) {
                        alert("You are not authorized to edit this pet.");
                        navigate("/dashboard-user");
                        return;
                    }

                    const sId = data.shelter_id || "";
                    const bId = data.breed_id || "";

                    setPet({
                        ...data,
                        birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
                        chipNumber: data.chipNumber || "",
                        photoUrl: data.photoUrl || "",
                        user_id: currentUserId ? String(currentUserId) : "",
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
    }, [id, backendUrl, userToken, currentUserId, navigate]);

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
            user_id: currentUserId ? Number(currentUserId) : null,
            shelter_id: pet.shelter_id ? Number(pet.shelter_id) : null,
            breed_id: pet.breed_id ? Number(pet.breed_id) : null
        };

        try {
            const response = await fetch(`${backendUrl}/api/pet-detail/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Pet updated successfully!");
                navigate("/dashboard-user");
            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                alert("Failed to update pet");
            }
        } catch (error) {
            console.error("Error updating pet:", error);
        }
    };

    if (!userToken) {
        return null;
    }

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading pet details...</p>
            </div>
        );
    }

    const currentUserName = users.find(u => Number(u.id) === Number(currentUserId))?.name || "Current User";

    return (
        <div className="container mt-4 mb-5">
            <Link to="/dashboard-user" className="btn btn-primary mb-3">
                ← Back to Dashboard
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
                            <label className="form-label">User (Owner)</label>
                            <input
                                type="text"
                                className="form-control bg-light"
                                value={currentUserName}
                                disabled
                            />
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
                                id="editCastratedUser"
                                checked={pet.castrated}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="editCastratedUser">
                                Is Castrated?
                            </label>
                        </div>
                    </div>

                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};