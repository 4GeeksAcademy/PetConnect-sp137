import { Link, useActionData } from "react-router-dom";
import { useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import React from "react";

export const ShelterCard = (props) => {
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const handleDelete = async () => {
  try {
    const response = await fetch(
      
      `${backendUrl}/api/shelter/${props.id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      console.error("Error al eliminar el refugio");
      return;
    }
    // Avisamos al padre
      props.onDelete(props.id);

  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
  <div className="card" style={{ width: "18rem" }}>
  <img src="https://www.mdzol.com/u/fotografias/m/2022/10/26/f768x1-1305623_1305750_79.jpg" className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">{props.name}</h5> 
  </div>
  <ul className="list-group list-group-flush">
    
    <li className="list-group-item">City: {props.city}</li>
    <li className="list-group-item">Address: {props.address}</li>
    <li className="list-group-item">Código Postal: {props.pc}</li>
    <li className="list-group-item">cif: {props.cif}</li>
    <li className="list-group-item">Email: {props.email}</li>
    <li className="list-group-item">Icon URL: {props.iconUrl}</li>

  </ul>
  <div className="card-body d-flex gap-4 justify-content-center">

    <Link to={`/shelterView/${props.id}`}>
      <span className="card-link btn btn-primary btn-sm" href="#" role="button">VER</span>
    </Link>
    <button className="btn btn-danger btn-sm" onClick={handleDelete}>ELIMINAR</button>
    <Link to={`/ShelterEdit/${props.id}`}>
      <span className="card-link btn btn-warning btn-sm" href="#" role="button">EDITAR</span>
    </Link>
  </div>
</div>
  ); 
};
