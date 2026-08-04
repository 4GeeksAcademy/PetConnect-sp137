import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Breed = () => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const [breeds, setBreeds] = useState([]);

    const API = "/api/breed";

    //GET

    const getBreeds = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            setBreeds(data);
        } catch (error) {
            console.log(error);
        }
    };


    // DELETE

    const deleteBreed = async (id) => {

        if (!window.confirm("¿Deseas eliminar esta raza?")) return;

        try {
            await fetch(`${API}/${id}`, {
                method: "DELETE"
            });

            getBreeds();

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBreeds();
    }, []);

    if (!store.adminUserAuth) {
        return (
            <div className="container mt-4">
                <p>Private Admin</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>CRUD de Razas</h2>

                <button
                    className="btn btn-success"
                    onClick={() => navigate("/breed/new")}
                >
                    Nueva raza
                </button>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Raza</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {breeds.map((breed) => (
                        <tr key={breed.id}>
                            <td>{breed.id}</td>
                            <td>{breed.breedName}</td>
                            <td>

                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => navigate(`/breed/edit/${breed.id}`)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteBreed(breed.id)}
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

export default Breed;

