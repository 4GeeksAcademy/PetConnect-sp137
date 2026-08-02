import { Link, useActionData, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import React from "react";

export const UserView = (props) => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (id) getUser();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/${id}`, { method: "DELETE" });
      if (!response.ok) {
        console.error("Error al eliminar el usuario");
        return;
      }
      if (props.onDelete) props.onDelete(id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!user) return <div>Cargando usuario...</div>;
  
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="card" style={{ width: "18rem" }}>
            <img src={user.iconUrl || 'https://www.mdzol.com/u/fotografias/m/2022/10/26/f768x1-1305623_1305750_79.jpg'} className="card-img-top" alt="..."/>
            <div className="card-body">
              <h5 className="card-title">{user.name}</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">City: {user.city}</li>
              <li className="list-group-item">Address: {user.address}</li>
              <li className="list-group-item">Código Postal: {user.pc}</li>
              <li className="list-group-item">cif: {user.cif}</li>
              <li className="list-group-item">Email: {user.email}</li>
              <li className="list-group-item">Icon URL: {user.iconUrl}</li>
            </ul>
            <div className="card-body d-flex gap-4 justify-content-center">
              <Link to="/user">
                <span className="card-link btn btn-primary btn-sm" href="#" role="button">Volver</span>
              </Link>
            </div>
          </div>
        </div>
      );

    }