import { Link, useActionData } from "react-router-dom";
import { useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import React from "react";

export const UserCard = (props) => {
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const handleDelete = async () => {
  try {
    const response = await fetch(
      
      `${backendUrl}/api/user/${props.id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      console.error("Error al eliminar el usuario");
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
  <img src="https://media.istockphoto.com/id/1017008332/ko/%EC%82%AC%EC%A7%84/%EA%B7%B8%EC%9D%98-%ED%8C%80%EA%B3%BC-%ED%95%A8%EA%BB%98-%EB%B9%A8%EA%B0%84-%EC%A7%80%EB%8F%84%EC%9E%90%EC%9E%85%EB%8B%88%EB%8B%A4-%ED%8C%80%EC%9B%8C%ED%81%AC-%EA%B0%9C%EB%85%90%EC%9E%85%EB%8B%88%EB%8B%A4.jpg?s=170667a&w=0&k=20&c=31RdxrvUxtqghKuH7rJy8e9a0eHBnhCMYPHh5ZfGJXI=" className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">{props.name}</h5> 
  </div>
  <ul className="list-group list-group-flush">
    
    <li className="list-group-item">Ciudad: {props.city}</li>
    <li className="list-group-item">Dirección: {props.address}</li>
    <li className="list-group-item">Código Postal: {props.pc}</li>
    <li className="list-group-item">Nacimiento: {props.birthDate}</li>
    <li className="list-group-item">Email: {props.email}</li>

  </ul>
  <div className="card-body d-flex gap-4 justify-content-center">

    <Link to={`/user-view/${props.id}`}>
      <span className="card-link btn btn-primary btn-sm" href="#" role="button">VER</span>
    </Link>
    <button className="btn btn-danger btn-sm" onClick={handleDelete}>ELIMINAR</button>

    <Link to={`/userEdit/${props.id}`}>
      <span className="card-link btn btn-warning btn-sm" href="#" role="button">EDITAR</span>
    </Link>
  </div>
</div>

  ); 
};