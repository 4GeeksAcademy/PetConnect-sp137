import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const UserLogin = () => {
    const { dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/loginUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                alert("Incorrect user or password.");
                return;
            }

            const data = await response.json();

            localStorage.setItem("userToken", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            dispatch({ type: "set_user_auth", payload: data.access_token });
            dispatch({ type: "set_current_user", payload: data.user });

            navigate("/dashboard-user");
        } catch (error) {
            console.error("Error login User.", error);
        }
    };

 return (
    <div
      className="container d-flex justify-content-center align-items-center py-5"
        style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff8f0, #fefefe)"
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
          <h2 style={{ fontWeight: 700, color: "#5a4636" }}>LOGIN USER</h2>
        </div>

        <form  onSubmit={handleLogin} className="w-50 mx-auto">
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
                  background: "#ff9f43",
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
              onClick={() => navigate("/userCreate")}
            >
              Sign up!
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
