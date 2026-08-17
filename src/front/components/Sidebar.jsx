import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import imgPetConnect from "../assets/img/PetConnect.png";

export const Sidebar = () => {
  const { store } = useGlobalReducer();

  const isUserLoggedIn = store.userAuth !== null;
  const isVeterinarianLoggedIn = store.veterinarianAuth !== null;
  const isShelterLoggedIn = store.shelterAuth !== null;

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-primary vh-100" style={{ width: "250px" }}>
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none py-2">
        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm" style={{ width: "42px", height: "42px", flexShrink: 0 }}>
          <img src={imgPetConnect} alt="Pet Connect Logo" style={{ width: "44px", height: "44px", objectFit: "contain" }} />
        </div>
        <span className="fs-5 fw-bold">Pet Connect</span>
      </div>

      <hr className="border-top border-light opacity-25" />

      <ul className="nav nav-pills flex-column mb-auto">
        {isUserLoggedIn && (
          <>
            <li className="nav-item mb-1">
              <Link to="/dashboard-user" className="nav-link text-white active bg-transparent d-flex align-items-center">
                <i className="fa-solid fa-tachometer-alt me-2"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/sheltersView" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-house-chimney me-2"></i>
                <span>Shelters</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/veterinariansView" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-user-doctor me-2"></i>
                <span>Veterinarians</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/petRecomendation" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                <span>Pet Recommendation</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/adoption-survey" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-clipboard-question me-2"></i>
                <span>Adoption Survey</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/petSearch" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-magnifying-glass me-2"></i>
                <span>Pet Search</span>
              </Link>
            </li>
          </>
        )}

        {isVeterinarianLoggedIn && (
          <>
            <li className="nav-item mb-1">
              <Link to="/veterinarianDashboard" className="nav-link text-white active bg-transparent d-flex align-items-center">
                <i className="fa-solid fa-tachometer-alt me-2"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/veterinarianProfile" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-user-doctor me-2"></i>
                <span>Profile</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/manageAppointments" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-calendar-check me-2"></i>
                <span>Manage Appointments</span>
              </Link>
            </li>
          </>
        )}

        {isShelterLoggedIn && (
          <>
            <li className="nav-item mb-1">
              <Link to="/ShelterDashboard" className="nav-link text-white active bg-transparent d-flex align-items-center">
                <i className="fa-solid fa-tachometer-alt me-2"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/ShelterEditProfile/${shelterId}" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-user-gear me-2"></i>
                <span>Profile</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/ShelterDashboardAddPet" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-paw me-2"></i>
                <span>New pet</span>
              </Link>
            </li>
          </>
        )}

        {!isUserLoggedIn && !isVeterinarianLoggedIn && !isShelterLoggedIn && (
          <>
            <li className="nav-item mb-1">
              <Link to="/userCreate" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-user-plus me-2"></i>
                <span>Register User</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/ShelterCreate" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-house-medical me-2"></i>
                <span>Register Shelter</span>
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link to="/veterinarian/new" className="nav-link text-white d-flex align-items-center">
                <i className="fa-solid fa-user-nurse me-2"></i>
                <span>Register Veterinarian</span>
              </Link>
            </li>
          </>
        )}
      </ul>

      <hr className="border-top border-light opacity-25 my-2" />
    </div>
  );
};