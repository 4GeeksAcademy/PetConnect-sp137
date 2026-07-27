import React, { useEffect, useState } from "react";

const Breed = () => {
    const [breeds, setBreeds] = useState([]);
    const [breedName, setBreedName] = useState("");
    const [editingId, setEditingId] = useState(null);


    const API = import.meta.env.VITE_BACKEND_URL + "/api/breed";

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

    //POST

    const createBreed = async () => {
        if (!breedName.trim()) {
            alert("Escribe un nombre");
            return;
        }

        console.log("API:", API);
        console.log("Enviando:", breedName);

        try {
            const response = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    breedName: breedName
                })
            });

            console.log("Status:", response.status);

            const data = await response.json();
            console.log("Respuesta:", data);

            if (response.ok) {
                setBreedName("");
                getBreeds();
            }

        } catch (error) {
            console.log("Error:", error);
        }
    };
    //PUT

    const updateBreed = async (id, newBreedName) => {
        try {
            await fetch(`${API}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    breedName: newBreedName
                })
            });

            setBreedName("");
            setEditingId(null);
            getBreeds();

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

    return (
        <div className="container mt-5">
            <h2 className="mb-4">CRUD de Razas</h2>

            <div className="input-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de la raza"
                    value={breedName}
                    onChange={(e) => setBreedName(e.target.value)}
                />

                {editingId ? (
                    <button
                        className="btn btn-warning"
                        onClick={() => {
                            updateBreed(editingId, breedName);
                            setEditingId(null);
                            setBreedName("");
                        }}
                    >
                        Actualizar
                    </button>
                ) : (
                    <button
                        className="btn btn-success"
                        onClick={createBreed}
                    >
                        Agregar
                    </button>
                )}
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
                                    onClick={() => {
                                        setEditingId(breed.id);
                                        setBreedName(breed.breedName);
                                    }}
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