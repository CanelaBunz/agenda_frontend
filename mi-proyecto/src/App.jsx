import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CalendarApp from "./pages/CalendarApp";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />}>
                <Route path="/calendar" element={<CalendarApp />} />
            </Route>
            <Route path="/" element={<Navigate to="/calendar" />} />
        </Routes>
    );
};

export default App;