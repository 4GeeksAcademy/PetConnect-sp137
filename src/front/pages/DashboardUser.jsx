import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { PetCardAsUser } from "../components/PetCardAsUser";
import { MedicalAppointmentCardAsUser } from "../components/MedicalAppointmentCardAsUser";
import { AdoptionCardAsUser } from "../components/AdoptionCardAsUser";
import { Geolocation } from "../components/Geolocation";
import { UserCardMatchPets } from "../components/UserCardMatchPets.jsx";

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
    const [uploading, setUploading] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
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
        photo_url: "",
        latitude: "",
        longitude: ""
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
                        photo_url: loggedUser.photo_url || "",
                        latitude: loggedUser.latitude || "0.0",
                        longitude: loggedUser.longitude || "0.0"
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

    const preparePayload = (currentPhotoUrl) => ({
        name: userFormData.name,
        email: userFormData.email,
        legal_document: userFormData.legalDocument,
        legalDocument: userFormData.legalDocument,
        address: userFormData.address,
        birth_date: userFormData.birthDate,
        birthDate: userFormData.birthDate,
        pc: userFormData.pc,
        city: userFormData.city,
        latitude: userFormData.latitude !== "" ? Number(userFormData.latitude) : null,
        longitude: userFormData.longitude !== "" ? Number(userFormData.longitude) : null,
        photo_url: currentPhotoUrl !== undefined ? currentPhotoUrl : userFormData.photo_url
    });

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserFormData({
            ...userFormData,
            [name]: value
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
                const newPhotoUrl = data.secure_url;

                setUserFormData((prev) => ({
                    ...prev,
                    photo_url: newPhotoUrl
                }));

                const updateResponse = await fetch(`${backendUrl}/api/user/${currentUserId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    },
                    body: JSON.stringify(preparePayload(newPhotoUrl))
                });

                if (!updateResponse.ok) {
                    console.error("Failed to update photo_url in database");
                }
            }
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            alert("Could not upload the image.");
        } finally {
            setUploading(false);
        }
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
                body: JSON.stringify(preparePayload())
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

    return (
        <div className="container my-5" style={{ color: "#193139" }}>
            <div className="card border-0 shadow-lg mb-5 overflow-hidden" style={{ borderRadius: "16px" }}>
                <div
                    className="p-4 d-flex justify-content-between align-items-center text-white"
                    style={{ backgroundColor: "#4c4d5570", cursor: "pointer" }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    <div className="d-flex align-items-center">
                        {userFormData.photo_url ? (
                            <img
                                src={userFormData.photo_url}
                                alt="User Profile"
                                className="rounded-circle border border-2 border-white shadow-sm me-3"
                                style={{ width: "65px", height: "65px", objectFit: "cover" }}
                            />
                        ) : (
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                                style={{ width: "65px", height: "65px", fontSize: "1.6rem", backgroundColor: "rgba(255, 255, 255, 0.2)", color: "#183139" }}
                            >
                                <i className="fa-solid fa-user"></i>
                            </div>
                        )}
                        <div>
                            <h3 className="mb-0 fw-bold" style={{ color: "#183139" }}>{userFormData.name || "User Profile"}</h3>
                            <small style={{ color: "#183139" }}>
                                Click to {isProfileOpen ? "hide" : "edit"} profile details
                            </small>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        className="btn rounded-circle text-white border-0"
                        style={{ backgroundColor: "#193139dc", width: "42px", height: "42px" }}
                    >
                        <i className={`fa-solid ${isProfileOpen ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                    </button>
                </div>

                {isProfileOpen && (
                    <div className="card-body p-4 p-md-5" style={{ backgroundColor: "#fdfbf7" }}>
                        <form onSubmit={handleSaveUserChanges}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        value={userFormData.name}
                                        onChange={handleUserChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        value={userFormData.email}
                                        onChange={handleUserChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Legal Document</label>
                                    <input
                                        type="text"
                                        name="legalDocument"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        value={userFormData.legalDocument}
                                        onChange={handleUserChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Birth Date</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        value={userFormData.birthDate}
                                        onChange={handleUserChange}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label fw-semibold">User Image</label>
                                    <input
                                        type="file"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                    {uploading && <small className="text-muted d-block mt-1">Uploading image...</small>}
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label fw-semibold">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        value={userFormData.address}
                                        onChange={handleUserChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Postal Code (PC)</label>
                                    <input
                                        type="text"
                                        name="pc"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        value={userFormData.pc}
                                        onChange={handleUserChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        value={userFormData.city}
                                        onChange={handleUserChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        value={userFormData.latitude}
                                        onChange={handleUserChange}
                                        placeholder="e.g. 40.4168"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        className="form-control border-1 p-2"
                                        style={{ borderRadius: "10px", borderColor: "#183139" }}
                                        value={userFormData.longitude}
                                        onChange={handleUserChange}
                                        placeholder="e.g. -3.7038"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn fw-semibold mt-4 px-4 py-2 text-white"
                                style={{ backgroundColor: "#183139", borderRadius: "10px" }}
                                disabled={uploading}
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-4 d-flex align-items-stretch" >
                    <div className="card p-4 border-0 shadow-sm w-100" style={{ borderRadius: "30px", backgroundColor: "#4c4d5516" }}> 
                        <h3 className="fw-bold mb-1" style={{ color: "#183139" }}>Match Pets</h3>
                        <UserCardMatchPets />
                    </div>
                </div>

                <div className="col-lg-8 d-flex align-items-stretch">
                    <div className="card p-4 border-0 shadow-sm w-100" style={{ borderRadius: "30px", backgroundColor: "#4c4d5516" }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold mb-0" style={{ color: "#183139" }}>My Pets</h3>
                            <button
                                className="btn text-white fw-semibold px-3 py-2"
                                style={{ backgroundColor: "#183139", borderRadius: "15px" }}
                                onClick={() => navigate("/create-pet-user")}
                            >
                                + New Pet
                            </button>
                        </div>

                        {pets.length === 0 ? (
                            <p className="text-muted mb-0">You have no pets registered yet.</p>
                        ) : (
                            <div className="row g-3">
                                {pets.map(pet => (
                                    <div className="col-12 col-md-6" key={pet.id}>
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
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-6 d-flex align-items-stretch">
                    <div className="card p-4 border-0 shadow-sm w-100" style={{ borderRadius: "16px", backgroundColor: "#4c4d5516" }}>
                        <h3 className="fw-bold mb-4" style={{ color: "#183139" }}>Medical Appointments</h3>

                        {medicalAppointments.length === 0 ? (
                            <p className="text-muted mb-0">You have no medical appointments scheduled yet.</p>
                        ) : (
                            <div className="row g-3">
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
                    </div>
                </div>

                <div className="col-lg-6 d-flex align-items-stretch">
                    <div className="card p-4 border-0 shadow-sm w-100" style={{ borderRadius: "16px", backgroundColor: "#4c4d5516" }}>
                        <h3 className="fw-bold mb-4" style={{ color: "#183139" }}>My Adoptions</h3>

                        {adoptions.length === 0 ? (
                            <p className="text-muted mb-0">You have no adoptions registered yet.</p>
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
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 d-flex justify-content-center">
                    <div className="card p-4 border-0 shadow-sm w-100" style={{ borderRadius: "16px", backgroundColor: "#4c4d5516" }}>
                        <h3 className="fw-bold mb-4 text-center" style={{ color: "#183139" }}>My Location</h3>

                        <div
                            className="w-100 overflow-hidden shadow-sm d-flex flex-column"
                            style={{ height: "450px", borderRadius: "12px" }}
                        >
                            <Geolocation
                                latitude={userFormData.latitude}
                                longitude={userFormData.longitude}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};