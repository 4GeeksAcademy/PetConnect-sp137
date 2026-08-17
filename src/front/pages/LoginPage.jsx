import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container py-5 d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff8f0, #fefefe)"
      }}
    >
      <div
        className="p-4 rounded-4 shadow-lg"
        style={{
          background: "white",
          width: "900px",
          border: "2px solid #f3e8d9"
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
            alt="paw"
            width="60"
            className="mb-3"
          />
          <h2 style={{ fontWeight: 700, color: "#5a4636" }}>
            Welcome to PetConnect
          </h2>
          <p className="text-muted" style={{ fontSize: "15px" }}>
            Chose your connection type:
          </p>
        </div>


        <div className="row row-cols-1 row-cols-md-3 g-4">

          <div className="col">
            <div
              className="card text-center p-4 border-0 shadow-sm rounded-4"
              style={{ background: "#fff4e6" }}
            >
              <i
                className="bx bx-user-circle"
                style={{ fontSize: "60px", color: "#ff9f43" }}
              ></i>

              <h5 className="mt-3" style={{ fontWeight: 600 }}>
                USER
              </h5>

              <button
                className="btn w-100 mt-3 rounded-pill"
                style={{
                  background: "#ff9f43",
                  color: "white",
                  fontWeight: 600
                }}
                onClick={() => navigate("/userLogin")}
              >
                LOGIN
              </button>
            </div>
          </div>

          <div className="col">
            <div
              className="card text-center p-4 border-0 shadow-sm rounded-4"
              style={{ background: "#e9f7ef" }}
            >
              <i
                className="bx bxs-dog"
                style={{ fontSize: "60px", color: "#2ecc71" }}
              ></i>

              <h5 className="mt-3" style={{ fontWeight: 600 }}>
                SHELTER
              </h5>

              <button
                className="btn w-100 mt-3 rounded-pill"
                style={{
                  background: "#2ecc71",
                  color: "white",
                  fontWeight: 600
                }}
                onClick={() => navigate("/shelterLogin")}
              >
                LOGIN
              </button>
            </div>
          </div>

          <div className="col">
            <div
              className="card text-center p-4 border-0 shadow-sm rounded-4"
              style={{ background: "#e8f8ff" }}
            >
              <i
                className="bx bxs-band-aid"
                style={{ fontSize: "60px", color: "#3498db" }}
              ></i>

              <h5 className="mt-3" style={{ fontWeight: 600 }}>
                VETERINARIAN
              </h5>

              <button
                className="btn w-100 mt-3 rounded-pill"
                style={{
                  background: "#3498db",
                  color: "white",
                  fontWeight: 600
                }}
                onClick={() => navigate("/loginVeterinarian")}
              >
                LOGIN
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
