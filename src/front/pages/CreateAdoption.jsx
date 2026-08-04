import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const CreateAdoption = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);
    const [pets, setPets] = useState([]);
    const [shelters, setShelters] = useState([]);

    const initialFormState = {
        user_id: "",
        pet_id: "",
        shelter_id: "",
        date: "",
        state: "Sent",
        comment: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resUsers, resPets, resShelters] = await Promise.all([
                    fetch(`${backendUrl}/api/user`),
                    fetch(`${backendUrl}/api/pets`),
                    fetch(`${backendUrl}/api/shelter`)
                ]);

                const usersData = resUsers.ok ? await resUsers.json() : [];
                const petsData = resPets.ok ? await resPets.json() : [];
                const sheltersData = resShelters.ok ? await resShelters.json() : [];

                setUsers(usersData);
                setPets(petsData);
                setShelters(sheltersData);

                // Seleccionar automáticamente el primer elemento si existe disponible
                setFormData((prev) => ({
                    ...prev,
                    user_id: usersData.length > 0 ? String(usersData[0].id) : "",
                    pet_id: petsData.length > 0 ? String(petsData[0].id) : "",
                    shelter_id: sheltersData.length > 0 ? String(sheltersData[0].id) : ""
                }));

            } catch (error) {
                console.error("Error fetching options:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [backendUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData({
            ...initialFormState,
            user_id: users.length > 0 ? String(users[0].id) : "",
            pet_id: pets.length > 0 ? String(pets[0].id) : "",
            shelter_id: shelters.length > 0 ? String(shelters[0].id) : ""
        });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/adoptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Adoption request created successfully!");
                resetForm();
                navigate("/adoptions");
            } else {
                alert("Failed to create adoption request.");
            }
        } catch (error) {
            console.error("Error creating adoption:", error);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading form options...</p>
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
        <div className="container mt-4 d-flex flex-column gap-3 align-items-start">
            <Link to="/adoptions" className="btn btn-primary">
                ← Back to Adoptions List
            </Link>

            <div className="card p-4 mb-5 shadow-sm w-100">
                <h3>Create Adoption Request</h3>
                <form onSubmit={handleCreate}>
                    <div className="row g-3 mt-1">
                        {/* SELECT USER */}
                        <div className="col-md-4">
                            <label className="form-label">User</label>
                            <select
                                name="user_id"
                                className="form-select"
                                value={formData.user_id}
                                onChange={handleChange}
                                required
                            >
                                {users.map((item) => (
                                    <option key={item.id} value={String(item.id)}>
                                        {item.name || item.email || `User #${item.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SELECT PET */}
                        <div className="col-md-4">
                            <label className="form-label">Pet</label>
                            <select
                                name="pet_id"
                                className="form-select"
                                value={formData.pet_id}
                                onChange={handleChange}
                                required
                            >
                                {pets.map((item) => (
                                    <option key={item.id} value={String(item.id)}>
                                        {item.name || `Pet #${item.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SELECT SHELTER */}
                        <div className="col-md-4">
                            <label className="form-label">Shelter</label>
                            <select
                                name="shelter_id"
                                className="form-select"
                                value={formData.shelter_id}
                                onChange={handleChange}
                                required
                            >
                                {shelters.map((item) => (
                                    <option key={item.id} value={String(item.id)}>
                                        {item.name || `Shelter #${item.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DATE */}
                        <div className="col-md-6">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                name="date"
                                className="form-control"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* STATE */}
                        <div className="col-md-6">
                            <label className="form-label">State</label>
                            <select
                                name="state"
                                className="form-select"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            >
                                <option value="Sent">Sent</option>
                                <option value="Paid">Paid</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        {/* COMMENT */}
                        <div className="col-md-12">
                            <label className="form-label">Comment</label>
                            <textarea
                                name="comment"
                                className="form-control"
                                rows="3"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Add optional comments..."
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">
                        Submit Adoption Request
                    </button>
                </form>
            </div>
        </div>
    );
};