import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBreed = () => {
    const [breedName, setBreedName] = useState("");
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const API = import.meta.env.VITE_BACKEND_URL + "/api/breed";

    const createBreed = async () => {
        if (!breedName.trim()) return;

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

            if (response.ok) {
                navigate("/breed");
            }

        } catch (error) {
            console.log(error);
        }
    };

    if (!store.adminUserAuth) {
        return (
            <div className="container mt-4">
                <p>Private Admin</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">

            <h2>Crear raza</h2>

            <input
                type="text"
                className="form-control my-3"
                placeholder="Nombre de la raza"
                value={breedName}
                onChange={(e) => setBreedName(e.target.value)}
            />

            <button
                className="btn btn-success me-2"
                onClick={createBreed}
            >
                Guardar
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

export default CreateBreed;