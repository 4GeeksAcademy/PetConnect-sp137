import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditVeterinarian = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        city: "",
        address: "",
        email: "",
        pc: "",
        iconUrl: "",
        iban: "",
        schedule: ""
    });

    const API = "/api/veterinarians";

    // Obtener veterinario por ID
    const getVeterinarian = async () => {
        try {
            const response = await fetch(`${API}/${id}`);
            const data = await response.json();

            setForm(data);

        } catch (error) {
            console.log(error);
        }
    };

    // Actualizar veterinario
    const updateVeterinarian = async () => {
        try {
            const response = await fetch(`${API}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                navigate("/veterinarian");
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getVeterinarian();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mt-5">

            <h2>Editar Veterinario</h2>

            <input
                className="form-control my-2"
                name="name"
                placeholder="Nombre"
                value={form.name}
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
                onClick={() => navigate("/veterinarian")}
            >
                Cancelar
            </button>

        </div>
    );
};

export default EditVeterinarian;