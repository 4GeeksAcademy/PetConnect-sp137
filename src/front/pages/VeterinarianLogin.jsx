import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const VeterinarianLogin = () => {

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
            const response = await fetch(`${backendUrl}/api/loginVeterinarian`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            localStorage.setItem("veterinariantoken", data.access_token);
            
            if (data.veterinarian) {
                localStorage.setItem("veterinarian", JSON.stringify(data.veterinarian));
                dispatch({
                    type: "set_current_veterinarian",
                    payload: data.veterinarian
                });
            }

            dispatch({
                type: "set_veterinarian_auth",
                payload: { token: data.access_token }
            });

            navigate("/veterinarianDashboard");
        } catch (err) {
            setError(err.message);
        }
    };

     return (
    <div
      className="container d-flex justify-content-center align-items-center py-5"
        style={{
        minHeight: "100vh",
        background: "#e8f8ff"
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
          <h2 style={{ fontWeight: 700, color: "#5a4636" }}>LOGIN VETERINARIAN</h2>
        </div>

        {error && (
            <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="w-50 mx-auto">
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
            <label htmlFor="exampleInputPassword" className="form-label">PASSWORD</label>
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
                  background: "#3498db",
                  color: "white",
                  fontWeight: 600
                }}
          >
            LOGIN
          </button>

          <p className="text-center mt-3 text-muted">
            ¿Not registered?{" "}
            <span
              style={{ color: "#2ecc71", cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate("/registerVeterinarian")}
            >
              Sign up!
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}