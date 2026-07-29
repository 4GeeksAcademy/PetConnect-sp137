import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Form = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        city: "",
        CIF: "",
        adress: "",
        pc: "",
        iconUrl: "",
        IBAN: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

   
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

            console.log("Enviando datos a:", backendUrl + "/api/shelter")
            console.log("Datos del formulario:", formData)

            const response = await fetch(backendUrl + "/api/shelter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el refugio")
            }

            setSuccess(true)
            setFormData({
                name: "",
                email: "",
                city: "",
                CIF: "",
                adress: "",
                pc: "",
                iconUrl: "",
                IBAN: ""
            })

            // Redirigir a home después de 2 segundos
            setTimeout(() => {
                navigate("/")
            }, 2000)
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2 className="mb-4">Formulario de Crear Refugio</h2>

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
                            <label htmlFor="CIF" className="form-label">CIF</label>
                            <input
                                type="text"
                                className="form-control"
                                id="CIF"
                                name="CIF"
                                value={formData.CIF}
                                onChange={handleChange}
                                placeholder="CIF del refugio"
                            />
                        </div>

                        {/* Dirección */}
                        <div className="mb-3">
                            <label htmlFor="adress" className="form-label">Dirección</label>
                            <input
                                type="text"
                                className="form-control"
                                id="adress"
                                name="adress"
                                value={formData.adress}
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
                            <label htmlFor="IBAN" className="form-label">IBAN</label>
                            <input
                                type="text"
                                className="form-control"
                                id="IBAN"
                                name="IBAN"
                                value={formData.IBAN}
                                onChange={handleChange}
                                placeholder="IBAN para donaciones"
                            />
                        </div>

                        {/* Botones */}
                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Guardar Refugio"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/")}
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
