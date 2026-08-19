import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./loginPage.css";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <div className="login-page-wrapper p-3 p-md-5">
      <div className="container-fluid h-100 d-flex flex-column p-0">
        
        <div className="d-flex justify-content-center gap-2 gap-md-3 mb-0 w-100">
          <button
            className={`btn flex-fill nav-tab-custom ${
              activeTab === "user" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("user")}
          >
            <i className="bx bx-user-circle me-2"></i> USER
          </button>

          <button
            className={`btn flex-fill nav-tab-custom ${
              activeTab === "shelter" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("shelter")}
          >
            <i className="bx bxs-dog me-2"></i> SHELTER
          </button>

          <button
            className={`btn flex-fill nav-tab-custom ${
              activeTab === "veterinarian" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("veterinarian")}
          >
            <i className="bx bxs-band-aid me-2"></i> VETERINARIAN
          </button>
        </div>

        <section className="about-choose-full p-4 p-md-5">
          {activeTab === "user" && <UserLoginForm />}
          {activeTab === "shelter" && <ShelterLoginForm />}
          {activeTab === "veterinarian" && <VeterinarianLoginForm />}
        </section>
      </div>
    </div>
  );
};

/* ==========================================
   FORMULARIO USER
   ========================================== */
const UserLoginForm = () => {
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
    <div className="row align-items-center w-100 m-0">
      <div className="col-lg-6 col-12 mb-4 mb-lg-0 text-center">
        <div className="about-us-two">
          <img
            src="https://lapetsitting.com/images/services_hero_banners.png"
            alt="User Pet Sitting"
            className="img-fluid rounded-4"
          />
        </div>
      </div>

      <div className="col-lg-6 col-12">
        <div className="choose-left">
          <h6>Pet Care You CAN Count On</h6>
          <h1 className="mb-4">
            User <br />
            <span>Login Access</span>
          </h1>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-muted fw-bold small mb-1">
                E-MAIL
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="form-control form-control-custom"
                placeholder="enter your email..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-muted fw-bold small mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="form-control form-control-custom"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-login-submit w-100">
              LOGIN
            </button>

            <p className="text-center mt-3 text-muted">
              ¿Not registered?
              <span
                className="text-brand-color"
                onClick={() => navigate("/userCreate")}
              >
                Sign up!
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   FORMULARIO SHELTER
   ========================================== */
const ShelterLoginForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/api/shelterLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      dispatch({ type: "set_shelter_auth", payload: data.access_token });
      dispatch({ type: "set_current_shelter", payload: data.shelter });

      navigate("/shelterDashboard");
    } catch (err) {
      setError(err.message || "Error de conexión al iniciar sesión.");
    }
  };

  return (
    <div className="row align-items-center w-100 m-0">
      <div className="col-lg-6 col-12 mb-4 mb-lg-0 text-center">
        <div className="about-us-two">
          <img
            src="https://lapetsitting.com/images/services_hero_banners.png"
            alt="Shelter Care"
            className="img-fluid rounded-4"
          />
        </div>
      </div>

      <div className="col-lg-6 col-12">
        <div className="choose-left">
          <h6>Pet Care You CAN Count On</h6>
          <h1 className="mb-4">
            Shelter <br />
            <span>Partner Portal</span>
          </h1>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger rounded-pill px-3 py-2 small" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label text-muted fw-bold small mb-1">
                E-MAIL
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="form-control form-control-custom"
                placeholder="shelter@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-muted fw-bold small mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="form-control form-control-custom"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-login-submit w-100">
              LOGIN
            </button>

            <p className="text-center mt-3 text-muted">
              ¿Not registered?
              <span
                className="text-brand-color"
                onClick={() => navigate("/shelterCreate")}
              >
                Sign up!
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   FORMULARIO VETERINARIAN
   ========================================== */
const VeterinarianLoginForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/api/loginVeterinarian`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("veterinariantoken", data.access_token);
      localStorage.setItem("veterinarian", JSON.stringify(data.veterinarian));
      dispatch({ type: "set_veterinarian_auth", payload: data.access_token });
      dispatch({ type: "set_current_veterinarian", payload: data.veterinarian });

      navigate("/veterinarianDashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="row align-items-center w-100 m-0">
      <div className="col-lg-6 col-12 mb-4 mb-lg-0 text-center">
        <div className="about-us-two">
          <img
            src="https://lapetsitting.com/images/services_hero_banners.png"
            alt="Veterinary Services"
            className="img-fluid rounded-4"
          />
        </div>
      </div>

      <div className="col-lg-6 col-12">
        <div className="choose-left">
          <h6>Pet Care You CAN Count On</h6>
          <h1 className="mb-4">
            Veterinarian <br />
            <span>Clinic Access</span>
          </h1>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger rounded-pill px-3 py-2 small" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label text-muted fw-bold small mb-1">
                E-MAIL
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="form-control form-control-custom"
                placeholder="vet@clinic.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-muted fw-bold small mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="form-control form-control-custom"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-login-submit w-100">
              LOGIN
            </button>

            <p className="text-center mt-3 text-muted">
              ¿Not registered?
              <span
                className="text-brand-color"
                onClick={() => navigate("/registerVeterinarian")}
              >
                Sign up!
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;