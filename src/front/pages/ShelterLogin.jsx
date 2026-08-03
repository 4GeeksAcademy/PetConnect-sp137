import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

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
            dispatch({
                type: "set_shelter_auth",
                payload: { token: data.access_token }
            });

            navigate("/shelterDashboard");
        } catch (err) {
            setError(err.message || "Error de conexión al iniciar sesión.");
        }
    };


    return (
        <div>
            <div className="text-center mt-5">
                <h1 className="display-4">Inicie Sesión</h1>
            </div>
            <form className="w-50 mx-auto" onSubmit={handleSubmit}>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary"> Login </button>
            </form>
        </div>
    )

}