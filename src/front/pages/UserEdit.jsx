import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserEdit = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        legalDocument: "",
        birthDate: "",
        email: "",
        city: "",
        adress: "",
        pc: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL + "/api/user";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUser();
    };

    // búsqueda por id
    const getUser = async () => {
        try {
            const response = await fetch(`${API}/${id}`);
            const data = await response.json();

            setFormData({
                name: data.name || "",
                legalDocument: data.legalDocument || "",
                birthDate: data.birthDate || "",
                email: data.email || "",
                password: data.password || "",
                city: data.city || "",
                address: data.address || "",
                pc: data.pc || ""
            });

        } catch (error) {
            console.log(error);}
    };

    // Actualizar
    const updateUser = async () => {
        if (!formData.name.trim() || !formData.email.trim()) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${API}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al actualizar el usuario");
                setLoading(false);
                return;
            }

            setSuccess(true);
            navigate("/user");

        } catch (error) {
            console.log(error);
            setError(error.message || "Error al actualizar el usuario");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2 className="mb-4">Crear Refugio</h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>)}

                    {success && (
                        <div className="alert alert-success" role="alert">
                            ¡Refugio creado exitosamente!
                        </div>)}

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
                                placeholder="Nombre del refugio"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="CIF" className="form-label">DNI/NIE</label>
                            <input
                                type="text"
                                className="form-control"
                                id="legalDocument"
                                name="legalDocument"
                                value={formData.legalDocument}
                                onChange={handleChange}
                                placeholder="Documento legal"/>
                        </div>
                        
                        {/* Fecha de Nacimiento */}
                        <div className="mb-3">
                            <label htmlFor="CIF" className="form-label">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}/>
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
                                placeholder="correo@ejemplo.com"/>
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
                                placeholder="contraseña"/>
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
                                placeholder="Ciudad"/>
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
                                placeholder="Dirección completa"/>
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
                                placeholder="Código postal"/>
                        </div>

                        {/* Botones */}
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-warning me-2"
                                onClick={updateUser}>
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/user")}
                                disabled={loading}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserEdit;

