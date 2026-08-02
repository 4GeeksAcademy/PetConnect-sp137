import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const DashboardUser = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        if (!store.userAuth) {
            navigate("/userLogin");
        }
    }, [store.userAuth, navigate]);

    if (!store.userAuth) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        dispatch({ type: "set_user_auth", payload: null });
        navigate("/");
    };

    return (
        <div className="container mt-5 text-center">
            <h1>Dashboard User</h1>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
    );
};