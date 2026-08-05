import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { PetCardAsUser } from "../components/PetCardAsUser";
import { MedicalAppointmentCardAsUser } from "../components/MedicalAppointmentCardAsUser";
import { AdoptionCardAsUser } from "../components/AdoptionCardAsUser";

export const DashboardUser = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [pets, setPets] = useState([]);
    const [users, setUsers] = useState([]);
    const [shelters, setShelters] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [medicalAppointments, setMedicalAppointments] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);
    const [adoptions, setAdoptions] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const currentUserId = store.currentUser?.id;
    const userToken = store.userAuth;

    const [userFormData, setUserFormData] = useState({
        name: "",
        email: "",
        legalDocument: "",
        address: "",
        birthDate: "",
        pc: "",
        city: "",
        photoUrl: ""
    });

    useEffect(() => {
        if (!store.userAuth) {
            navigate("/userLogin");
            return;
        }

        if (!currentUserId) {
            return;
        }

        const fetchData = async () => {
            try {
                const headers = { "Authorization": `Bearer ${userToken}` };

                const userRes = await fetch(`${backendUrl}/api/user/${currentUserId}`, { headers });
                if (userRes.ok) {
                    const loggedUser = await userRes.json();
                    setUserFormData({
                        name: loggedUser.name || "",
                        email: loggedUser.email || "",
                        legalDocument: loggedUser.legalDocument || "",
                        address: loggedUser.address || "",
                        birthDate: loggedUser.birthDate || "",
                        pc: loggedUser.pc || "",
                        city: loggedUser.city || "",
                        photoUrl: loggedUser.photoUrl || ""
                    });
                }

                const petsRes = await fetch(`${backendUrl}/api/pets`, { headers });
                if (petsRes.ok) {
                    const allPets = await petsRes.json();
                    setPets(allPets.filter(pet => Number(pet.user_id) === Number(currentUserId)));
                }

                const breedsRes = await fetch(`${backendUrl}/api/breed`, { headers });
                if (breedsRes.ok) {
                    setBreeds(await breedsRes.json());
                }

                const usersRes = await fetch(`${backendUrl}/api/user`, { headers });
                if (usersRes.ok) {
                    setUsers(await usersRes.json());
                }

                const sheltersRes = await fetch(`${backendUrl}/api/shelter`, { headers });
                if (sheltersRes.ok) {
                    setShelters(await sheltersRes.json());
                }

                const appointmentsRes = await fetch(`${backendUrl}/api/medical-appointments`, { headers });
                if (appointmentsRes.ok) {
                    const allAppointments = await appointmentsRes.json();
                    setMedicalAppointments(allAppointments.filter(app => Number(app.user_id) === Number(currentUserId)));
                }

                const vetsRes = await fetch(`${backendUrl}/api/veterinarians`, { headers });
                if (vetsRes.ok) {
                    setVeterinarians(await vetsRes.json());
                }

                const adoptionsRes = await fetch(`${backendUrl}/api/adoptions`, { headers });
                if (adoptionsRes.ok) {
                    const allAdoptions = await adoptionsRes.json();
                    setAdoptions(allAdoptions.filter(adpt => Number(adpt.user_id) === Number(currentUserId)));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [store.userAuth, currentUserId, navigate, backendUrl, userToken]);

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
                method: "DELETE",
                headers: { "Authorization": `Bearer ${userToken}` }
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
                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={goShelters}>Shelters</button>
                    <button className="btn btn-info" onClick={goVeterinarians}>Veterinarians</button>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="card p-4 mb-5 shadow-sm">
                <div className="row align-items-center mb-4">
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                        {userFormData.photoUrl ? (
                            <img
                                src={userFormData.photoUrl}
                                alt="User Profile"
                                className="rounded-circle img-thumbnail shadow-sm"
                                style={{ width: "130px", height: "130px", objectFit: "cover" }}
                            />
                        ) : (
                            <div
                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto shadow-sm"
                                style={{ width: "130px", height: "130px", fontSize: "3rem" }}
                            >
                                <i className="fa-solid fa-user"></i>
                            </div>
                        )}
                    </div>
                    <div className="col-md-9">
                        <h3 className="mb-1">User Profile</h3>
                    </div>
                </div>

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
                            <label className="form-label">Photo URL</label>
                            <input
                                type="url"
                                name="photoUrl"
                                className="form-control"
                                placeholder="https://example.com/photo.jpg"
                                value={userFormData.photoUrl}
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
                <p className="text-muted mb-5">You have no pets registered yet.</p>
            ) : (
                <div className="row g-3 mb-5">
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

            <div className="mb-3">
                <h2>Medical Appointments</h2>
            </div>

            {medicalAppointments.length === 0 ? (
                <p className="text-muted mb-5">You have no medical appointments registered yet.</p>
            ) : (
                <div className="row g-3 mb-5">
                    {medicalAppointments.map(appointment => (
                        <MedicalAppointmentCardAsUser
                            key={appointment.id}
                            appointment={appointment}
                            users={users}
                            pets={pets}
                            veterinarians={veterinarians}
                        />
                    ))}
                </div>
            )}

            <div className="mb-3">
                <h2>My Adoptions</h2>
            </div>

            {adoptions.length === 0 ? (
                <p className="text-muted">You have no adoptions registered yet.</p>
            ) : (
                <div className="row g-3">
                    {adoptions.map(adoption => (
                        <AdoptionCardAsUser
                            key={adoption.id}
                            adoption={adoption}
                            users={users}
                            pets={pets}
                            shelters={shelters}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};