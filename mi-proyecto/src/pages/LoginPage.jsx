import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles.css";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await fetch("http://tu-api.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          onLogin();
          navigate("/calendar"); // Redirige a /calendar
        } else {
          alert("Credenciales incorrectas.");
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    } else {
      alert("Por favor, ingresa tu email y contraseña.");
    }
  };

  return (
    <div className="login-page p-d-flex p-jc-center p-ai-center p-min-vh-100">
      <Card className="p-shadow-8" style={{ width: "400px" }}>
        <h2 className="p-text-center">Iniciar Sesión</h2>
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
          <div className="p-d-flex p-jc-between p-mt-4">
            <Button
              label="Iniciar Sesión"
              icon="pi pi-sign-in"
              onClick={handleLogin}
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