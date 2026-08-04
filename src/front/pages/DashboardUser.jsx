import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { PetCardAsUser } from "../components/PetCardAsUser";

export const DashboardUser = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [pets, setPets] = useState([]);
    const [users, setUsers] = useState([]);
    const [shelters, setShelters] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const currentUserId = store.currentUser?.id || JSON.parse(localStorage.getItem("user"))?.id;
    const userToken = store.userAuth || localStorage.getItem("userToken");

    const [userFormData, setUserFormData] = useState({
        name: "",
        email: "",
        legalDocument: "",
        address: "",
        birthDate: "",
        pc: "",
        city: ""
    });

    useEffect(() => {
        if (!store.userAuth) {
            navigate("/userLogin");
            return;
        }

        const fetchData = async () => {
            try {
                const [resPets, resBreeds, resUsers, resShelters] = await Promise.all([
                    fetch(`${backendUrl}/api/pets`),
                    fetch(`${backendUrl}/api/breed`),
                    fetch(`${backendUrl}/api/user`),
                    fetch(`${backendUrl}/api/shelter`)
                ]);

                if (resPets.ok) {
                    const allPets = await resPets.json();
                    const myPets = allPets.filter(pet => pet.user_id === currentUserId);
                    setPets(myPets);
                }
                if (resBreeds.ok) setBreeds(await resBreeds.json());
                if (resShelters.ok) setShelters(await resShelters.json());

                if (resUsers.ok) {
                    const allUsers = await resUsers.json();
                    setUsers(allUsers);
                    const loggedUser = allUsers.find(u => u.id === currentUserId);
                    if (loggedUser) {
                        setUserFormData({
                            name: loggedUser.name || "",
                            email: loggedUser.email || "",
                            legalDocument: loggedUser.legalDocument || "",
                            address: loggedUser.address || "",
                            birthDate: loggedUser.birthDate ? loggedUser.birthDate.split("T")[0] : "",
                            pc: loggedUser.pc || "",
                            city: loggedUser.city || ""
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (currentUserId) {
            fetchData();
        }
    }, [store.userAuth, currentUserId, navigate, backendUrl]);

    if (!store.userAuth) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        dispatch({ type: "set_user_auth", payload: null });
        dispatch({ type: "set_current_user", payload: null });
        navigate("/");
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserFormData({
            ...userFormData,
            [name]: value
        });
    };

    const handleSaveUserChanges = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/user/${currentUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify(userFormData)
            });

            if (response.ok) {
                alert("User profile updated successfully!");
            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                alert("Failed to update user profile");
            }
        } catch (error) {
            console.error("Error updating user profile:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pet?")) return;
        try {
            const response = await fetch(`${backendUrl}/api/pets/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                setPets(pets.filter(pet => pet.id !== id));
            }
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-pet-user/${id}`);
    };

    const goShelters = () => {
        navigate(`/sheltersView`);
    };

    const goVeterinarians = () => {
        navigate(`/veterinariansView`);
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Dashboard User</h1>
                <button className="btn btn-success" onClick={goShelters}>Shelters</button>
                <button className="btn btn-info" onClick={goVeterinarians}>Veterinarians</button>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            <div className="card p-4 mb-5 shadow-sm">
                <h3 className="mb-3">User Profile</h3>
                <form onSubmit={handleSaveUserChanges}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={userFormData.name}
                                onChange={handleUserChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={userFormData.email}
                                onChange={handleUserChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Legal Document</label>
                            <input
                                type="text"
                                name="legalDocument"
                                className="form-control"
                                value={userFormData.legalDocument}
                                onChange={handleUserChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Birth Date</label>
                            <input
                                type="date"
                                name="birthDate"
                                className="form-control"
                                value={userFormData.birthDate}
                                onChange={handleUserChange}
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-control"
                                value={userFormData.address}
                                onChange={handleUserChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Postal Code (PC)</label>
                            <input
                                type="text"
                                name="pc"
                                className="form-control"
                                value={userFormData.pc}
                                onChange={handleUserChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">City</label>
                            <input
                                type="text"
                                name="city"
                                className="form-control"
                                value={userFormData.city}
                                onChange={handleUserChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success mt-4">Save Changes</button>
                </form>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Pets</h2>
                <button className="btn btn-primary" onClick={() => navigate("/create-pet-user")}>
                    New Pet
                </button>
            </div>

            {pets.length === 0 ? (
                <p className="text-muted">You have no pets registered yet.</p>
            ) : (
                <div className="row g-3">
                    {pets.map(pet => (
                        <div className="col-12" key={pet.id}>
                            <PetCardAsUser
                                pet={pet}
                                users={users}
                                shelters={shelters}
                                breeds={breeds}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};