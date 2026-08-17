import React from "react";
import { useNavigate } from "react-router-dom";

export const VeterinarianDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5 text-center">
            <h1>Veterinarian Dashboard</h1>

            <p className="mb-4">
                Bienvenido al panel privado del veterinario.
            </p>

            <div className="d-flex justify-content-center gap-3">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/veterinarianProfile")}
                >
                    Mi Perfil
                </button>

                <button
                    className="btn btn-success"
                    onClick={() => navigate("/manageAppointments")}
                >
                    Gestionar Citas
                </button>
            </div>
        </div>
    );
};