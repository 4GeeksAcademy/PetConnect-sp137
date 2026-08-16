import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
//import pawsBg from "../assets/img/paws.jpg";

export const ShelterLogin = () => {

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${backendUrl}/api/shelterLogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.msg || "Error al iniciar sesión. Verifica tus credenciales.");
                return;
            }

            if (!data.access_token) {
                setError("No se recibió token de autenticación.");
                return;
            }

            localStorage.setItem("sheltertoken", data.access_token);
            localStorage.setItem("shelter", JSON.stringify(data.shelter));
            dispatch({
                type: "set_shelter_auth",
                payload: data.access_token
            });
            dispatch({
                type: "set_current_shelter",
                payload: data.shelter
            });

            navigate("/shelterDashboard");
        } catch (err) {
            setError(err.message || "Error de conexión al iniciar sesión.");
        }
    };

 return (
    <div
       className="container d-flex justify-content-center align-items-center py-5"
        style={{
            minHeight: "100vh",
            background: "#e9f7ef"
        }}>
      <div
        className="p-4 rounded-4 shadow-lg"
        style={{
          background: "white",
          width: "600px",
          border: "2px solid #c9f3d9"
        }}
      >
        <div className="text-center mb-4">
          <i className="bx bxs-dog" style={{ fontSize: "70px", color: "#2ecc71" }}></i>
          <h2 style={{ fontWeight: 700, color: "#5a4636" }}>LOGIN SHELTER</h2>
        </div>

        <form  className="w-50 mx-auto" onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
          <div className="mb-3">
            <label htmlFor="exampleInputEmail" className="form-label">E-MAIL</label>
            <input 
                type="email"
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                className="form-control rounded-pill"
                required
                />

          </div>

          <div className="mb-4">
            <label htmlFor="exampleInputEmail" className="form-label">PASSWORD</label>
            <input 
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="form-control rounded-pill"
                required
                />
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-pill"
                style={{
                  background: "#2ecc71",
                  color: "white",
                  fontWeight: 600
                }}
          >
            CONNECT
          </button>

          <p className="text-center mt-3 text-muted">
            ¿Not registered?{" "}
            <span
              style={{ color: "#2ecc71", cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate("/shelterCreate")}
            >
              Sign up!
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};