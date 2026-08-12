import React from "react";
import { useNavigate } from "react-router-dom";

export const VeterinarianCardCheck = (props) => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate("/book-medical-appointment", {
      state: { veterinarianId: props.id || props.veterinarianId }
    });
  };

  return (
    <div className="card mb-4 shadow-sm w-100">
      <img
        src={props.iconUrl}
        className="card-img-top"
        alt="..."
        style={{ height: "200px", objectFit: "cover" }}
      />
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