import React, { useEffect, useState } from "react";

const Breed = () => {
    const [breeds, setBreeds] = useState([]);
    const [breedName, setBreedName] = useState("");

    const API = process.env.BACKEND_URL + "/api/breed";

    const getBreeds = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            setBreeds(data);
        } catch (error) {
            console.log(error);
        }
    };

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
                setBreedName("");
                getBreeds();
            }
        } catch (error) {
            console.log(error);
        }
    };

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

            getBreeds();

        } catch (error) {
            console.log(error);
        }
    };
    const deleteBreed = async (id) => {
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
        <div>
            <h1>Breed CRUD</h1>
        </div>
    );
};
export default Breed;