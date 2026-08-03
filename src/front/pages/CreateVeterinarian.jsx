import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateVeterinarian = () => {

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

    const API = "/api/veterinarians";

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                navigate("/veterinarian");
            } else {
                alert("Error al crear el veterinario");
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mt-5">

            <h2>Nuevo Veterinario</h2>

            <form onSubmit={handleSubmit}>

                <input
                    className="form-control mb-3"
                    name="name"
                    placeholder="Nombre"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="city"
                    placeholder="Ciudad"
                    value={form.city}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="address"
                    placeholder="Dirección"
                    value={form.address}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="pc"
                    placeholder="Código postal"
                    value={form.pc}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="iconUrl"
                    placeholder="URL del icono"
                    value={form.iconUrl}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="iban"
                    placeholder="IBAN"
                    value={form.iban}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="schedule"
                    placeholder="Horario"
                    value={form.schedule}
                    onChange={handleChange}
                />

                <button className="btn btn-success">
                    Guardar
                </button>

            </form>

        </div>
    );
};

export default CreateVeterinarian;