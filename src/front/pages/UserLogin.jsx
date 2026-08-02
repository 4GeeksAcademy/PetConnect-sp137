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

            dispatch({ type: "set_user_auth", payload: data.access_token });

            navigate("/dashboard-user");
        } catch (error) {
            console.error("Error login User.", error);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2>User Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
};