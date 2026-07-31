import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Veterinarian = () => {
    const navigate = useNavigate();

    const [veterinarians, setVeterinarians] = useState([]);

    const API = "/api/veterinarians";

    // GET
    const getVeterinarians = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            setVeterinarians(data);
        } catch (error) {
            console.log(error);
        }
    };

    // DELETE
    const deleteVeterinarian = async (id) => {

        if (!window.confirm("¿Deseas eliminar este veterinario?")) return;

        try {
            await fetch(`${API}/${id}`, {
                method: "DELETE"
            });

            getVeterinarians();

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getVeterinarians();
    }, []);

    return (
        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>CRUD de Veterinarios</h2>

                <button
                    className="btn btn-success"
                    onClick={() => navigate("/veterinarian/new")}
                >
                    Nuevo veterinario
                </button>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Ciudad</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {veterinarians.map((veterinarian) => (
                        <tr key={veterinarian.id}>
                            <td>{veterinarian.id}</td>
                            <td>{veterinarian.name}</td>
                            <td>{veterinarian.city}</td>
                            <td>{veterinarian.email}</td>
                            <td>

                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => navigate(`/veterinarian/edit/${veterinarian.id}`)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteVeterinarian(veterinarian.id)}
                                >
                                    Eliminar
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default Veterinarian;