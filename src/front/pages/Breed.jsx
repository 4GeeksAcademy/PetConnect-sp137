import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
<<<<<<< ours
=======
>>>>>>> theirs
const Breed = () => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const [breeds, setBreeds] = useState([]);
    const [dogBreed, setDogBreed] = useState("");
    const [dogImage, setDogImage] = useState("");
    const [dogBreeds, setDogBreeds] = useState([]);

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

    const getDogBreeds = async () => {
        try {
            const response = await fetch("/api/dog-breeds");
            const data = await response.json();

            setDogBreeds(Object.keys(data.message));

        } catch (error) {
            console.log(error);
        }
    };

    const searchDogBreed = async () => {
        if (!dogBreed.trim()) return;

        try {
            const response = await fetch(
                `/api/dog-breeds/${dogBreed.toLowerCase().trim()}/image`
            );

            const data = await response.json();

            if (!response.ok) {
                setDogImage("");
                alert("Raza no encontrada");
                return;
            }

            setDogImage(data.image);
        } catch (error) {
            console.log(error);
            setDogImage("");
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
        getDogBreeds();
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
            <div className="d-flex gap-2 mb-4">
                <select
                    className="form-select"
                    value={dogBreed}
                    onChange={(e) => setDogBreed(e.target.value)}
                >
                    <option value="">Selecciona una raza</option>

                    {dogBreeds.map((breed) => (
                        <option key={breed} value={breed}>
                            {breed.charAt(0).toUpperCase() + breed.slice(1)}
                        </option>
                    ))}
                </select>

                <button
                    className="btn btn-primary"
                    onClick={searchDogBreed}
                    disabled={!dogBreed}
                >
                    Buscar
                </button>
            </div>

            {dogImage && (
                <div className="card" style={{ width: "350px" }}>
                    <img
                        src={dogImage}
                        className="card-img-top"
                        alt={dogBreed}
                        style={{
                            height: "250px",
                            objectFit: "cover"
                        }}
                    />

                    <div className="card-body">
                        <h5 className="card-title text-capitalize">
                            {dogBreed}
                        </h5>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Breed;

