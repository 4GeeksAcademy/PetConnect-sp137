import React from "react";

export const VeterinarianCardCheck = (props) => {
  return (
    <div className="card mb-4 shadow-sm w-100">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNlLp9m6uvJrnhaH_48u5vtFJQluNVGSth4Ljmg8gKzW08LOjgYIJ1C_Q&s=10.png"
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
    </div>
  );
};