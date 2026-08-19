import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const UserNavbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const isUser = store.userAuth !== null;
  const isShelter = store.shelterAuth !== null;
  const isVeterinarian = store.veterinarianAuth !== null;

  let displayName = "";
  let displayImage = "";
  let handleLogout = null;

  if (isUser && store.currentUser) {
    displayName = store.currentUser.name || "User";
    displayImage = store.currentUser.photo_url || "";
    handleLogout = () => {
      dispatch({ type: "set_user_auth", payload: null });
      dispatch({ type: "set_current_user", payload: null });
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      navigate("/");
    };
  } else if (isShelter && store.currentShelter) {
    displayName = store.currentShelter.name || "Shelter";
    displayImage = store.currentShelter.iconUrl || "";
    handleLogout = () => {
      dispatch({ type: "set_shelter_auth", payload: null });
      dispatch({ type: "set_current_shelter", payload: null });
      localStorage.removeItem("sheltertoken");
      localStorage.removeItem("shelter");
      navigate("/");
    };
  } else if (isVeterinarian) {
    displayName = store.currentVeterinarian?.name || "Veterinarian";
    displayImage = store.currentVeterinarian?.photoUrl || "";
    handleLogout = () => {
      dispatch({ type: "set_veterinarian_auth", payload: null });
      dispatch({ type: "set_current_veterinarian", payload: null });
      localStorage.removeItem("veterinariantoken");
      localStorage.removeItem("veterinarian");
      navigate("/");
    };
  }

  return (
    <nav className="navbar navbar-expand navbar-light bg-white px-4 shadow-sm py-2 mb-4 rounded">
      <div className="container-fluid justify-content-end">
        <div className="d-flex align-items-center">
          {displayName && <span className="fw-bold me-3 text-dark">{displayName}</span>}

          <div
            className="bg-white rounded-circle d-flex align-items-center justify-content-center border me-3 overflow-hidden shadow-sm"
            style={{ width: "40px", height: "40px", flexShrink: 0 }}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <i className="fa-solid fa-user text-secondary"></i>
            )}
          </div>

          {handleLogout && (
            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm d-flex align-items-center"
            >
              <i className="fa-solid fa-right-from-bracket me-1"></i>
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};