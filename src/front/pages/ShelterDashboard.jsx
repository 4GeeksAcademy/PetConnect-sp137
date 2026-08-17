import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

export const ShelterDashboard = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [pets, setPets] = useState([]);
    const [adoptions, setAdoptions] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const parseStoredShelter = () => {
        try {
            return JSON.parse(localStorage.getItem("shelter") || "null");
        } catch {
            return null;
        }
    };

    const currentShelter = store.currentShelter || parseStoredShelter();
    const currentShelterId = currentShelter?.id;

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([fetchPets(), fetchUsers(), fetchAdoptions()]);
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchPets = async () => {
        try {
            if (!currentShelterId) {
                setPets([]);
                return;
            }
            const response = await fetch(`${backendUrl}/api/pets`);
            if (response.ok) {
                const data = await response.json();
                setPets(data);
            }
        } catch (error) {
            console.error("Error fetching pets:", error);
        }
    };

    const fetchAdoptions = async () => {
        try {
            if (!currentShelterId) {
                setAdoptions([]);
                return;
            }
            const response = await fetch(`${backendUrl}/api/adoptions?shelter_id=${currentShelterId}`);
            if (response.ok) {
                const data = await response.json();
                setAdoptions(data);
            }
        } catch (error) {
            console.error("Error fetching adoptions:", error);
        }
    };

    useEffect(() => {
        if (!store.shelterAuth) {
            navigate("/shelterLogin");
            return;
        }

        fetchAllData();
    }, [store.shelterAuth, navigate, backendUrl]);

    if (!store.shelterAuth) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("sheltertoken");
        localStorage.removeItem("shelter");
        dispatch({ type: "set_shelter_auth", payload: null });
        dispatch({ type: "set_current_shelter", payload: null });
        navigate("/");
    };

    const getUserName = (userId) => {
        const user = users.find((item) => String(item.id) === String(userId));
        return user?.name || "Unknown Applicant";
    };

    const getPetName = (petId) => {
        const pet = pets.find((item) => String(item.id) === String(petId));
        return pet?.name || "Unknown Animal";
    };

    const updateAdoptionState = async (adoptionId, newState) => {
        try {
            const adoptionToUpdate = adoptions.find((item) => item.id === adoptionId);
            if (!adoptionToUpdate) return;

            const response = await fetch(`${backendUrl}/api/adoptions/${adoptionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: adoptionToUpdate.user_id,
                    pet_id: adoptionToUpdate.pet_id,
                    shelter_id: adoptionToUpdate.shelter_id,
                    date: adoptionToUpdate.date,
                    state: newState,
                    comment: adoptionToUpdate.comment || ""
                })
            });

            if (response.ok) {
                if (newState.toLowerCase() === "approved" || newState.toLowerCase() === "accepted") {
                    const petToUpdate = pets.find((p) => String(p.id) === String(adoptionToUpdate.pet_id));
                    if (petToUpdate) {
                        await fetch(`${backendUrl}/api/pet-detail/${adoptionToUpdate.pet_id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                ...petToUpdate,
                                user_id: adoptionToUpdate.user_id,
                                shelter_id: null
                            })
                        });
                    }
                } else if (newState.toLowerCase() === "rejected") {
                    const petToUpdate = pets.find((p) => String(p.id) === String(adoptionToUpdate.pet_id));
                    if (petToUpdate) {
                        await fetch(`${backendUrl}/api/pet-detail/${adoptionToUpdate.pet_id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                ...petToUpdate,
                                user_id: null,
                                shelter_id: currentShelterId
                            })
                        });
                    }
                }

                await fetchAllData();
                alert(`La solicitud de adopción de ${getPetName(adoptionToUpdate.pet_id)} por ${getUserName(adoptionToUpdate.user_id)} ha sido ${newState.toLowerCase()}.`);
            } else {
                console.error("Error updating adoption state", response.status);
                alert("No se pudo actualizar el estado de la solicitud.");
            }
        } catch (error) {
            console.error("Error updating adoption state:", error);
            alert("Error al actualizar la solicitud de adopción.");
        }
    };

    const handleApprove = (adoption) => {
        updateAdoptionState(adoption.id, "Approved");
    };

    const handleReject = (adoption) => {
        updateAdoptionState(adoption.id, "Rejected");
    };

    const shelterPets = pets.filter((pet) => {
        const petShelterId = String(pet.shelter_id || pet.idShelter || "");
        return currentShelterId ? petShelterId === String(currentShelterId) : false;
    });

    const shelterAdoptions = adoptions.filter((item) => {
        const adoptionShelterId = String(item.shelter_id || item.idShelter || "");
        return currentShelterId ? adoptionShelterId === String(currentShelterId) : false;
    });

    const registeredAnimalsCount = shelterPets.length;
    const acceptedAdoptionsCount = shelterAdoptions.filter((item) => {
        const status = String(item.state || "").trim().toLowerCase();
        return ["approved", "accepted"].includes(status);
    }).length;
    const pendingAdoptionsCount = shelterAdoptions.filter((item) => String(item.state || "").trim().toLowerCase() === "pending").length;

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column">
            <div className="row flex-grow-1">
                {/*<aside className="col-md-3 col-lg-2 d-flex flex-column justify-content-between p-3 border-end bg-white shadow-sm">
                    <div>
                        <div className="d-flex align-items-center mb-4">
                            <div className="border rounded bg-secondary-subtle me-2" style={{ width: "40px", height: "40px" }}></div>
                            <h1 className="h5 mb-0 fw-bold">{store.currentShelter?.name || "Shelter Name"}</h1>
                        </div>
                        <nav className="nav flex-column gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-primary text-start w-100 fw-semibold"
                                onClick={() => {
                                    const shelterId = store.currentShelter?.id;
                                    if (shelterId) {
                                        navigate(`/ShelterEditProfile/${shelterId}`);
                                    } else {
                                        navigate("/shelterLogin");
                                    }
                                }}
                            >
                                + PROFILE
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-primary text-start w-100 fw-semibold"
                                onClick={() => {
                                    const shelterId = store.currentShelter?.id;
                                    if (shelterId) {
                                        navigate(`/ShelterDashboardAddPet`);
                                    } else {
                                        navigate("/shelterLogin");
                                    }
                                }}
                            >
                                + ADD ANIMAL
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-primary text-start w-100 fw-semibold"
                                onClick={() => {
                                    const shelterId = store.currentShelter?.id;
                                    if (shelterId) {
                                        navigate(`/ShelterDashboardAdoptionPet`);
                                    } else {
                                        navigate("/shelterLogin");
                                    }
                                }}
                            >
                                + ADD ADOPTION
                            </button>
                        </nav>
                    </div>
                    <div>
                        <button onClick={handleLogout} className="btn btn-warning w-100 fw-bold shadow-sm" type="button">
                            Log-Out
                        </button>
                    </div>
                </aside>*/}
                <main className="col-md-9 col-lg-10 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fw-bold text-dark">DASHBOARD</h2>
                            <p className="text-muted mb-0">Panel de control general de la protectora.</p>
                        </div>
                    </div>

                    <section className="row g-3 mb-4">
                        <div className="col-sm-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                                <div className="card-body">
                                    <h6 className="card-subtitle text-muted fw-semibold">Registered Animals</h6>
                                    <h3 className="card-title my-2 fw-bold text-primary">{registeredAnimalsCount}</h3>
                                    <small className="text-muted">Total in system</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                                <div className="card-body">
                                    <h6 className="card-subtitle text-muted fw-semibold">Accepted Adoptions</h6>
                                    <h3 className="card-title my-2 fw-bold text-success">{acceptedAdoptionsCount}</h3>
                                    <small className="text-muted">Solicitud(es) aprobada(s)</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                                <div className="card-body">
                                    <h6 className="card-subtitle text-muted fw-semibold">Rejected Adoptions</h6>
                                    <h3 className="card-title my-2 fw-bold text-danger">{shelterAdoptions.filter((item) => String(item.state || "").trim().toLowerCase() === "rejected").length}</h3>
                                    <small className="text-muted">Solicitudes rechazadas</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                                <div className="card-body">
                                    <h6 className="card-subtitle text-muted fw-semibold">Pending Applications</h6>
                                    <h3 className="card-title my-2 fw-bold text-warning">{pendingAdoptionsCount}</h3>
                                    <small className="text-muted">Requires review</small>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-4 bg-white p-4 rounded-4 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-bold mb-0">Recent Animals</h4>
                        </div>
                        <div className="row g-3">
                            {loading ? (
                                <div className="col-12">
                                    <p className="text-muted">Loading animals...</p>
                                </div>
                            ) : shelterPets.length === 0 ? (
                                <div className="col-12">
                                    <p className="text-muted">No animals registered yet for this shelter.</p>
                                </div>
                            ) : (
                                shelterPets.slice(0, 3).map((pet) => (
                                    <div className="col-md-4" key={pet.id}>
                                        <div className="card border-0 shadow-sm rounded-3 h-100 bg-light">
                                            <div className="ratio ratio-16x9 border-bottom">
                                                <img
                                                    src={pet.photoUrl}
                                                    className="img-fluid w-100 h-100 rounded-top-3"
                                                    alt="Pet"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold">{pet.name}</h5>
                                                <p className="card-text mb-1"><strong>Gender:</strong> {pet.genre}</p>
                                                <p className="card-text mb-1"><strong>Size:</strong> {pet.size}</p>
                                                <p className="card-text mb-1"><strong>Color:</strong> {pet.color}</p>
                                                <p className="mb-1"><strong>Castrated:</strong> {pet.castrated ? "Yes" : "No"}</p>
                                                <small className="text-muted">{pet.birthDate ? `Birth date: ${pet.birthDate}` : "Birth date: Unknown"}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="d-flex justify-content-center mt-4">
                            <Link to={`/shelterDashboardViewPets/${currentShelterId}`} className="btn btn-success btn-lg px-5 py-2 fw-bold rounded-pill shadow-sm">
                                View all
                            </Link>
                        </div>
                    </section>

                    <section className="bg-white p-4 rounded-4 shadow-sm mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-bold mb-0">Adoption Applications</h4>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Animal</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-3">
                                                Cargando solicitudes...
                                            </td>
                                        </tr>
                                    ) : shelterAdoptions.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-3">
                                                No hay solicitudes de adopción.
                                            </td>
                                        </tr>
                                    ) : (
                                        shelterAdoptions.map((adoption) => {
                                            const status = String(adoption.state || "").trim().toLowerCase();
                                            const isApproved = status === "approved" || status === "accepted";
                                            const isRejected = status === "rejected";

                                            return (
                                                <tr key={adoption.id}>
                                                    <td className="fw-semibold">{getUserName(adoption.user_id)}</td>
                                                    <td>{getPetName(adoption.pet_id)}</td>
                                                    <td>{adoption.date || "--"}</td>
                                                    <td>
                                                        <span className={`badge ${isApproved ? "bg-success" : isRejected ? "bg-danger" : "bg-warning text-dark"}`}>
                                                            {adoption.state || "Pending"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {!isApproved && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-success me-1 fw-semibold"
                                                                    onClick={() => handleApprove(adoption)}
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger fw-semibold"
                                                                    onClick={() => handleReject(adoption)}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};