import { Link, useActionData, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import React from "react";

export const ShelterView = (props) => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [shelter, setShelter] = useState(null);

  useEffect(() => {
    const getShelter = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/shelter/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setShelter(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (id) getShelter();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/shelter/${id}`, { method: "DELETE" });
      if (!response.ok) {
        console.error("Error al eliminar el refugio");
        return;
      }
      if (props.onDelete) props.onDelete(id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!shelter) return <div>Cargando refugio...</div>;

/*   return (
    <div className="card justify-content-center" style={{ width: "18rem" }}>
      <img src={shelter.iconUrl || 'https://www.mdzol.com/u/fotografias/m/2022/10/26/f768x1-1305623_1305750_79.jpg'} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{shelter.name}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">City: {shelter.city}</li>
        <li className="list-group-item">Address: {shelter.address}</li>
        <li className="list-group-item">Código Postal: {shelter.pc}</li>
        <li className="list-group-item">cif: {shelter.cif}</li>
        <li className="list-group-item">Email: {shelter.email}</li>
        <li className="list-group-item">Icon URL: {shelter.iconUrl}</li> */
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="card" style={{ width: "18rem" }}>
            <img src={shelter.iconUrl || 'https://www.mdzol.com/u/fotografias/m/2022/10/26/f768x1-1305623_1305750_79.jpg'} className="card-img-top" alt="..."/>
            <div className="card-body">
              <h5 className="card-title">{shelter.name}</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">City: {shelter.city}</li>
              <li className="list-group-item">Address: {shelter.address}</li>
              <li className="list-group-item">Código Postal: {shelter.pc}</li>
              <li className="list-group-item">cif: {shelter.cif}</li>
              <li className="list-group-item">Email: {shelter.email}</li>
              <li className="list-group-item">Icon URL: {shelter.iconUrl}</li>
            </ul>
            <div className="card-body d-flex gap-4 justify-content-center">
              <Link to="/shelter">
                <span className="card-link btn btn-primary btn-sm" href="#" role="button">Volver</span>
              </Link>
            </div>
          </div>
        </div>
      );

    }