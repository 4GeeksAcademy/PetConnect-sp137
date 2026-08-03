import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ShelterDashboard = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        if (!store.shelterAuth) {
            navigate("/shelterLogin");
        }
    }, [store.shelterAuth, navigate]);

    if (!store.shelterAuth) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("sheltertoken");
        dispatch({ type: "set_shelter_auth", payload: null });
        navigate("/");
    };

    return (
        <div className="container mt-5 text-center">
            <h1>Dashboard Shelter</h1>

                        <button onClick={handleLogout} className=" btn btn-warning">Desconectar</button>
                    
                
        </div>
    );
};