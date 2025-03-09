import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles.css"; // Importa el archivo CSS
import api from "../services/api";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.register({ name, email, password });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                alert("Registro exitoso. Por favor, inicia sesión.");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error al registrar:", error);
            setError(error.response?.data?.message || "Error al registrar. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <Card className="p-card">
                <h2>Registro</h2>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="name">Nombre</label>
                        <InputText
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ingresa tu nombre"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu email"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="password">Contraseña</label>
                        <InputText
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <div className="p-d-flex p-jc-between p-mt-4">
                        <Button
                            label="Registrarse"
                            icon="pi pi-user-plus"
                            onClick={handleRegister}
                            loading={loading}
                            className={loading ? "p-button-loading" : ""}
                        />
                        <Button
                            label="Volver a Login"
                            icon="pi pi-sign-in"
                            className="p-button-secondary"
                            onClick={() => navigate("/login")}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;