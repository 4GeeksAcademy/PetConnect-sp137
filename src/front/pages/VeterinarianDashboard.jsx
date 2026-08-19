import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
/* import { Context } from "../store/appContext"; */
//import { MedicalAppointmentCardAsUser } from "../component/MedicalAppointmentCard";

export const VeterinarianDashboard = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [currentVet, setCurrentVet] = useState(null);

    useEffect(() => {

        const loadDashboardData = async () => {
            setLoading(true);
            
            let vet = store.currentVeterinarian || null;

            if (!vet && actions.getVeterinarianProfile) {
                vet = await actions.getVeterinarianProfile();
            }

            if (!vet) {
                const storedVetId = localStorage.getItem("veterinarian_id");
                if (storedVetId && store.veterinarians) {
                    vet = store.veterinarians.find(v => String(v.id) === String(storedVetId));
                }
            }

            setCurrentVet(vet);

            /*if (actions.getMedicalAppointments) await actions.getMedicalAppointments();*/
            /*if (actions.getUsers) await actions.getUsers();*/
            /*if (actions.getPets) await actions.getPets();*/
            /*if (actions.getVeterinarians) await actions.getVeterinarians();*/

            setLoading(false);
        };

        loadDashboardData();
    }, []);

    const vetAppointments = (store.medicalAppointments || []).filter(
        (app) => currentVet && String(app.veterinarian_id) === String(currentVet.id)
    );

    const totalAppointmentsCount = vetAppointments.length;
    
    const pendingAppointmentsCount = vetAppointments.filter(
        (app) => String(app.status || app.state || "").trim().toLowerCase() === "pending" || !app.status
    ).length;

    const completedAppointmentsCount = vetAppointments.filter(
        (app) => {
            const st = String(app.status || app.state || "").trim().toLowerCase();
            return st === "completed" || st === "accepted" || st === "approved";
        }
    ).length;

    const cancelledAppointmentsCount = vetAppointments.filter(
        (app) => {
            const st = String(app.status || app.state || "").trim().toLowerCase();
            return st === "cancelled" || st === "rejected";
        }
    ).length;

    const handleUpdateStatus = async (appointmentId, newStatus) => {
        if (actions.updateMedicalAppointmentStatus) {
            await actions.updateMedicalAppointmentStatus(appointmentId, newStatus);
        } else if (actions.updateMedicalAppointment) {
            await actions.updateMedicalAppointment(appointmentId, { status: newStatus });
        }
    };

    const getUserName = (userId) => {
        const found = (store.users || []).find((u) => String(u.id) === String(userId));
        return found ? found.name || found.email : `User #${userId}`;
    };

    const getPetName = (petId) => {
        const found = (store.pets || []).find((p) => String(p.id) === String(petId));
        return found ? found.name : `Pet #${petId}`;
    };

    return (
        <div className="container-fluid bg-light min-vh-100 py-4">
            <div className="container">
               
                <header className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded-4 shadow-sm">
                    <div>
                        <h2 className="fw-bold mb-1">
                            Veterinarian Dashboard
                        </h2>
                        {/*<p className="text-muted mb-0">
                            Welcome back, {currentVet ? currentVet.name : "Doctor"}! Manage your appointments and patients.
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Link
                            to="/editVeterinarianProfile"
                            className="btn btn-outline-primary rounded-pill fw-semibold"
                        >
                            Edit Profile
                        </Link>
                        <Link
                            to="/manageAppointments"
                            className="btn btn-primary rounded-pill fw-semibold"
                        >
                            Manage All Appointments
                        </Link>*/}
                    </div>
                </header>

                <section className="row g-3 mb-4">
                    <div className="col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                            <div className="card-body">
                                <h6 className="card-subtitle text-muted fw-semibold">Total Appointments</h6>
                                <h3 className="card-title my-2 fw-bold text-primary">{totalAppointmentsCount}</h3>
                                <small className="text-muted">All scheduled visits</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                            <div className="card-body">
                                <h6 className="card-subtitle text-muted fw-semibold">Pending Review</h6>
                                <h3 className="card-title my-2 fw-bold text-warning">{pendingAppointmentsCount}</h3>
                                <small className="text-muted">Awaiting confirmation</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                            <div className="card-body">
                                <h6 className="card-subtitle text-muted fw-semibold">Completed</h6>
                                <h3 className="card-title my-2 fw-bold text-success">{completedAppointmentsCount}</h3>
                                <small className="text-muted">Attended patients</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                            <div className="card-body">
                                <h6 className="card-subtitle text-muted fw-semibold">Cancelled</h6>
                                <h3 className="card-title my-2 fw-bold text-danger">{cancelledAppointmentsCount}</h3>
                                <small className="text-muted">Rejected or cancelled</small>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Citas Destacadas en Cards (usando MedicalAppointmentCardAsUser) */}
                <section className="mb-4 bg-white p-4 rounded-4 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0">Upcoming Appointments</h4>
                    </div>
                    <div className="row g-3">
                        {loading ? (
                            <div className="col-12">
                                <p className="text-muted">Loading appointments...</p>
                            </div>
                        ) : vetAppointments.length === 0 ? (
                            <div className="col-12">
                                <p className="text-muted">No appointments scheduled for your clinic yet.</p>
                            </div>
                        ) : (
                            vetAppointments.slice(0, 3).map((appointment) => (
                                <MedicalAppointmentCardAsUser
                                    key={appointment.id}
                                    appointment={appointment}
                                    users={store.users || []}
                                    pets={store.pets || []}
                                    veterinarians={store.veterinarians || []}
                                />
                            ))
                        )}
                    </div>
                </section>

                {/*<section className="bg-white p-4 rounded-4 shadow-sm mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0">Appointment Requests & Management</h4>
                    </div>
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Patient / Pet</th>
                                    <th>Owner</th>
                                    <th>Date & Hour</th>
                                    <th>Comments</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-3">
                                            Loading appointment details...
                                        </td>
                                    </tr>
                                ) : vetAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-3">
                                            No appointment requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    vetAppointments.map((app) => {
                                        const rawStatus = String(app.status || app.state || "pending").trim().toLowerCase();
                                        const isCompleted = rawStatus === "completed" || rawStatus === "approved" || rawStatus === "accepted";
                                        const isCancelled = rawStatus === "cancelled" || rawStatus === "rejected";

                                        return (
                                            <tr key={app.id}>
                                                <td className="fw-semibold">{getPetName(app.pet_id)}</td>
                                                <td>{getUserName(app.user_id)}</td>
                                                <td>{app.date || "--"} {app.hour ? `(${app.hour})` : ""}</td>
                                                <td>
                                                    <small className="text-muted">
                                                        {app.comments && app.comments.length > 40
                                                            ? `${app.comments.substring(0, 40)}...`
                                                            : app.comments || "N/A"}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        isCompleted
                                                            ? "bg-success"
                                                            : isCancelled
                                                            ? "bg-danger"
                                                            : "bg-warning text-dark"
                                                    }`}>
                                                        {app.status || app.state || "Pending"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {!isCompleted && !isCancelled && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-success me-1 fw-semibold"
                                                                onClick={() => handleUpdateStatus(app.id, "Completed")}
                                                            >
                                                                Approve / Complete
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger fw-semibold"
                                                                onClick={() => handleUpdateStatus(app.id, "Cancelled")}
                                                            >
                                                                Cancel
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
                </section>*/}
            </div>
        </div>
    );
};