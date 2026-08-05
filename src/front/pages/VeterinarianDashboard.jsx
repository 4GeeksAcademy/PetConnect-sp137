import React from "react";
import { useNavigate } from "react-router-dom";

export const VeterinarianDashboard = () => {

    const navigate = useNavigate();

    return (
        <div className="container mt-5 text-center">

            <h1>Veterinarian Dashboard</h1>

            <p>Bienvenido al panel privado del veterinario.</p>

            <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/veterinarianProfile")}
            >
                Mi Perfil
            </button>

        </div>
    );
};