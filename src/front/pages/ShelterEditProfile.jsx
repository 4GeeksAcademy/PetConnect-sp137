import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const ShelterEditProfile = () => {
    const { store } = useGlobalReducer();
    const params = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        city: "",
        cif: "",
        address: "",
        pc: "",
        iconUrl: "",
        iban: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL + "/api/shelter";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const shelterId = params.id || store.currentShelter?.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateShelter();
    };

    // búsqueda por id
    const getShelter = async () => {
        if (!shelterId) return;
        try {
            const response = await fetch(`${API}/${shelterId}`);
            const data = await response.json();

            setFormData({
                name: data.name || "",
                email: data.email || "",
                password: data.password || "",
                city: data.city || "",
                cif: data.cif || "",
                address: data.address || "",
                pc: data.pc || "",
                iconUrl: data.iconUrl || "",
                iban: data.iban || ""
            });
        } catch (error) {
            console.log(error);
            setError("Error al obtener los datos del refugio");
        }
    };

    // Actualizar
    const updateShelter = async () => {
        if (!formData.name.trim() || !formData.email.trim()) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${API}/${shelterId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al actualizar el refugio");
                setLoading(false);
                return;
            }

            setSuccess(true);
            navigate("/shelterview/" + shelterId);
            //navigate(`/shelterview/${shelterId}`);

        } catch (error) {
            console.log(error);
            setError(error.message || "Error al actualizar el refugio");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!shelterId) {
            navigate("/shelterLogin");
            return;
        }

        if (store.currentShelter && String(store.currentShelter.id) === String(shelterId)) {
            setFormData({
                name: store.currentShelter.name || "",
                email: store.currentShelter.email || "",
                password: store.currentShelter.password || "",
                city: store.currentShelter.city || "",
                cif: store.currentShelter.cif || "",
                address: store.currentShelter.address || "",
                pc: store.currentShelter.pc || "",
                iconUrl: store.currentShelter.iconUrl || "",
                iban: store.currentShelter.iban || ""
            });
        }

        getShelter();
    }, [shelterId, navigate, store.currentShelter]);

    if (!store.shelterAuth) {
        return (
            <div className="container mt-4">
                <p>Private Admin</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2 className="mb-4">Editar Perfil</h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" role="alert">
                            ¡Refugio creado exitosamente!
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Nombre */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nombre *</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Nombre del refugio"
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email *</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="correo@ejemplo.com"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password *</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="contraseña"
                            />
                        </div>

                        {/* Ciudad */}
                        <div className="mb-3">
                            <label htmlFor="city" className="form-label">Ciudad</label>
                            <input
                                type="text"
                                className="form-control"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Ciudad"
                            />
                        </div>

                        {/* CIF */}
                        <div className="mb-3">
                            <label htmlFor="cif" className="form-label">CIF</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cif"
                                name="cif"
                                value={formData.cif}
                                onChange={handleChange}
                                placeholder="CIF del refugio"
                            />
                        </div>

                        {/* Dirección */}
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Dirección</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Dirección completa"
                            />
                        </div>

                        {/* Código Postal */}
                        <div className="mb-3">
                            <label htmlFor="pc" className="form-label">Código Postal</label>
                            <input
                                type="text"
                                className="form-control"
                                id="pc"
                                name="pc"
                                value={formData.pc}
                                onChange={handleChange}
                                placeholder="Código postal"
                            />
                        </div>

                        {/* URL de Icono */}
                        <div className="mb-3">
                            <label htmlFor="iconUrl" className="form-label">URL del Icono</label>
                            <input
                                type="url"
                                className="form-control"
                                id="iconUrl"
                                name="iconUrl"
                                value={formData.iconUrl}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/icono.png"
                            />
                        </div>

                        {/* IBAN */}
                        <div className="mb-3">
                            <label htmlFor="iban" className="form-label">IBAN</label>
                            <input
                                type="text"
                                className="form-control"
                                id="iban"
                                name="iban"
                                value={formData.iban}
                                onChange={handleChange}
                                placeholder="IBAN para donaciones"
                            />
                        </div>

                        {/* Botones */}
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-warning me-2"
                                onClick={updateShelter}>
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/shelterDashboard")}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ShelterEditProfile;

