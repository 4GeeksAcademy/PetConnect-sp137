import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditVeterinarianProfile = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        password: "",
        city: "",
        address: "",
        email: "",
        pc: "",
        iconUrl: "",
        iban: "",
        schedule: ""
    });

    const API = `${import.meta.env.VITE_BACKEND_URL}/api/veterinarian/profile`;

    // Obtener perfil del veterinario
    const getProfile = async () => {
        try {
            const response = await fetch(API, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("veterinariantoken")}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setForm(data);
            } else {
                alert("No se pudo cargar el perfil");
            }

        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al cargar el perfil.");
        }
    };

    // Actualizar perfil del veterinario
    const updateVeterinarian = async () => {
        try {
            const response = await fetch(API, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("veterinariantoken")}`
                },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                navigate("/veterinarianProfile");
            } else {
                alert("No se pudo actualizar el perfil");
            }

        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al actualizar el perfil.");
        }
    };
    useEffect(() => {
        getProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };



    return (
        <div className="container mt-5">

            <h2>Editar Mi Perfil</h2>

            <input
                className="form-control my-2"
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
            />

            <input
                className="form-control mb-2"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
            />

            <input
                className="form-control my-2"
                name="city"
                placeholder="Ciudad"
                value={form.city}
                onChange={handleChange}
            />

            <input
                className="form-control my-2"
                name="address"
                placeholder="Dirección"
                value={form.address}
                onChange={handleChange}
            />

            <input
                className="form-control my-2"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />

            <input
                className="form-control my-2"
                name="pc"
                placeholder="Código Postal"
                value={form.pc}
                onChange={handleChange}
            />

            <input
                className="form-control my-2"
                name="iconUrl"
                placeholder="URL del icono"
                value={form.iconUrl}
                onChange={handleChange}
            />

            <input
                className="form-control my-2"
                name="iban"
                placeholder="IBAN"
                value={form.iban}
                onChange={handleChange}
            />

            <input
                className="form-control my-2"
                name="schedule"
                placeholder="Horario"
                value={form.schedule}
                onChange={handleChange}
            />

            <button
                className="btn btn-warning me-2"
                onClick={updateVeterinarian}
            >
                Guardar cambios
            </button>

            <button
                className="btn btn-secondary"
                onClick={() => navigate("/veterinarianProfile")}
            >
                Cancelar
            </button>

        </div>
    );
};

export default EditVeterinarianProfile;