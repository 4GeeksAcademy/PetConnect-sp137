import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBreed = () => {

    const { id } = useParams();
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [breedName, setBreedName] = useState("");

    const API = import.meta.env.VITE_BACKEND_URL + "/api/breed";

    // Obtener la raza por id
    const getBreed = async () => {
        try {
            const response = await fetch(`${API}/${id}`);
            const data = await response.json();

            setBreedName(data.breedName);

        } catch (error) {
            console.log(error);
        }
    };

    // Actualizar la raza
    const updateBreed = async () => {
        if (!breedName.trim()) return;

        try {
            const response = await fetch(`${API}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    breedName: breedName
                })
            });

            if (response.ok) {
                navigate("/breed");
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBreed();
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

            <h2>Editar raza</h2>

            <input
                type="text"
                className="form-control my-3"
                value={breedName}
                onChange={(e) => setBreedName(e.target.value)}
            />

            <button
                className="btn btn-warning me-2"
                onClick={updateBreed}
            >
                Guardar cambios
            </button>

            <button
                className="btn btn-secondary"
                onClick={() => navigate("/breed")}
            >
                Cancelar
            </button>

        </div>
    );
};

export default EditBreed;