import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VeterinarianProfile = () => {
    const navigate = useNavigate();
    const [veterinarian, setVeterinarian] = useState(null);

    useEffect(() => {

        const getProfile = async () => {

            const token = localStorage.getItem("veterinariantoken");

            try {

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/veterinarian/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setVeterinarian(data);
                }

            } catch (error) {
                console.log(error);
            }

        };

        getProfile();

    }, []);

    if (!veterinarian) {
        return <p className="text-center mt-5">Cargando perfil...</p>;
    }
    return (
        <div className="container mt-5">

            <h2>Mi Perfil</h2>

            <hr />
            <p><strong>Nombre:</strong> {veterinarian.name}</p>

            <p><strong>Email:</strong> {veterinarian.email}</p>

            <p><strong>Ciudad:</strong> {veterinarian.city}</p>

            <p><strong>Dirección:</strong> {veterinarian.address}</p>

            <p><strong>Código Postal:</strong> {veterinarian.pc}</p>

            <p><strong>Horario:</strong> {veterinarian.schedule}</p>

            <p><strong>IBAN:</strong> {veterinarian.iban}</p>

            <button
                className="btn btn-warning"
                onClick={() => navigate("/editVeterinarianProfile")}
            >
                Editar Perfil
            </button>
        </div>
    );
};

export default VeterinarianProfile;