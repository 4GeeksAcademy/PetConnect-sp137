import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const VeterinarianCardCheck = (props) => {
  const navigate = useNavigate();
  const [veterinarians, setVeterinarians] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleBookClick = () => {
    navigate("/book-medical-appointment", {
      state: { veterinarianId: props.id || props.veterinarianId }
    });
  };

  const defaultImage = "https://es.123rf.com/photo_185376169_sin-s%C3%ADmbolo-de-vector-de-imagen-falta-el-icono-disponible-no-hay-galer%C3%ADa-para-este-marcador-de.html";

  // Cargar veterinarios al montar el componente
  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/veterinarians`);
        if (res.ok) {
          const data = await res.json();
          setVeterinarians(data);
        }
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
      }
    };

    fetchVeterinarians();
  }, [backendUrl]);

  const currentVeterinarian = veterinarians.find(
    (vet) => Number(vet.id) === Number(props.id)
  );

  const veterinarianImageUrl =
    props.photoUrl ||
    props.photo_url ||
    currentVeterinarian?.photoUrl ||
    currentVeterinarian?.photo_url ||
    defaultImage;

  return (
    <div className="card mb-4 shadow-sm w-50">
      <div className="pc-shelter-list-image">
        <img
          src={veterinarianImageUrl}
          alt={props.name || "Veterinarian"}
          onError={(event) => {
            event.currentTarget.src = defaultImage;
          }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title text-center">{props.name}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item"><strong>City:</strong> {props.city}</li>
        <li className="list-group-item"><strong>Address:</strong> {props.address}</li>
        <li className="list-group-item"><strong>Postal Code:</strong> {props.pc}</li>
        <li className="list-group-item"><strong>Email:</strong> {props.email}</li>
        <li className="list-group-item"><strong>Schedule:</strong> {props.schedule}</li>
      </ul>
      <div className="card-body text-center">
        <button
          className="btn btn-primary w-100"
          onClick={handleBookClick}
        >
          Book Medical Appointment
        </button>
      </div>
    </div>
  );
};