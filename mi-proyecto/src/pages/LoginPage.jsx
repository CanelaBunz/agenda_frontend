import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles.css"; // Importa el archivo CSS
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Por favor, ingresa tu email y contraseña.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.login({ email, password });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                login();
                navigate("/calendar");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError(error.response?.data?.message || "Credenciales incorrectas. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Card className="p-card">
                <h2>Iniciar Sesión</h2>
                <div className="p-fluid">
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
                            label="Iniciar Sesión"
                            icon="pi pi-sign-in"
                            onClick={handleLogin}
                            loading={loading}
                            className={loading ? "p-button-loading" : ""}
                        />
                        <Button
                            label="Registrarse"
                            icon="pi pi-user-plus"
                            className="p-button-secondary"
                            onClick={() => navigate("/register")}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;