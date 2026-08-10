import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ShelterDashboardViewPets = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const navigate = useNavigate();
  const { store } = useGlobalReducer();
  const { id } = useParams();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPets = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/pets`);

        if (!res.ok) {
          const text = await res.text();
          console.error("Error fetching pets:", res.status, text.slice(0, 200));
          return;
        }

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Unexpected response from pets API:", text.slice(0, 200));
          return;
        }

        const data = await res.json();
        const storedShelter = store.currentShelter || JSON.parse(localStorage.getItem("shelter") || "null");
        const shelterId = id && id !== "undefined" && id !== "null" ? id : storedShelter?.id;

        if (!shelterId) {
          setPets([]);
          return;
        }

        if (Array.isArray(data)) {
          setPets(data);
        } else {
          setPets([]);
        }
      } catch (err) {
        console.error("Error loading pets:", err);
      } finally {
        setLoading(false);
      }
    };

    getPets();
  }, [backendUrl, id, store.currentShelter]);

  const handleDelete = async (pet_id) => {
    if (!window.confirm("¿Deseas eliminar esta mascota?")) return;

    try {
      const response = await fetch(`${backendUrl}/api/pets/${pet_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error al eliminar la mascota:", response.status, text.slice(0, 200));
        return;
      }

      setPets((currentPets) => currentPets.filter((pet) => pet.id !== pet_id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pets</h2>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/shelterDashboard")}>
          Back
        </button>
      </div>

      {loading ? (
        <div>Cargando mascotas...</div>
      ) : pets.length === 0 ? (
        <div className="alert alert-info">No hay mascotas registradas.</div>
      ) : (
        <div className="row g-4">
          {pets.map((pet) => (
            <div className="col-md-4" key={pet.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src="/src/front/assets/img/pet1.jpg"
                  className="img-fluid w-100 h-100"
                  alt="Pet"
                  style={{ objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{pet.name}</h5>
                  <p className="mb-1"><strong>Gender:</strong> {pet.genre}</p>
                  <p className="mb-1"><strong>Size:</strong> {pet.size}</p>
                  <p className="mb-1"><strong>Color:</strong> {pet.color}</p>
                  <p className="mb-1"><strong>Birth date:</strong> {pet.birthDate || "Unknown"}</p>
                  <p className="mb-1"><strong>Castrated:</strong> {pet.castrated ? "Yes" : "No"}</p>
                  <div className="mt-3 gap-2 d-flex justify-content-between">
                    <Link to={`/shelterDashboardEditPet/${pet.id}`} className="btn btn-warning btn-sm">
                      EDITAR
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(pet.id)}>ELIMINAR</button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};