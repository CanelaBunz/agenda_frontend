import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Importa el AuthContext
import api from "../services/api"; // Importa tu API
import ContactSidebar from "../components/ContactSidebar";
import CalendarComponent from "../components/CalendarComponent";
import EventDialog from "../components/EventDialog";
import EventsModal from "../components/EventsModal";
import FriendRequestMenu from "../components/FriendRequestMenu";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles.css";

const CalendarApp = () => {
    const { logout } = useContext(AuthContext); // Consume la función logout del contexto
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventDialogVisible, setEventDialogVisible] = useState(false);
    const [editEventDialogVisible, setEditEventDialogVisible] = useState(false);
    const [eventsModalVisible, setEventsModalVisible] = useState(false);
    const [friendRequestMenuVisible, setFriendRequestMenuVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        start_time: null,
        end_time: null,
        visibility: "PRIVATE", // Valor predeterminado para Spring Boot
    });

    // Cargar eventos al montar el componente
    useEffect(() => {
        fetchEvents();
    }, []);

    // Obtener eventos desde el backend
    const fetchEvents = async () => {
        try {
            // Calcular un rango de fechas (3 meses antes y después del mes actual)
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 4, 0);

            const response = await api.getEvents(start, end);
            setEvents(response.data);
        } catch (error) {
            console.error("Error al cargar eventos:", error);
        }
    };

    // Abrir el diálogo para crear un evento
    const openEventDialog = () => {
        setEventDialogVisible(true);
    };

    // Cerrar el diálogo para crear un evento
    const closeEventDialog = () => {
        setEventDialogVisible(false);
        setNewEvent({ 
            title: "", 
            description: "", 
            start_time: null, 
            end_time: null,
            visibility: "PRIVATE" // Valor predeterminado para Spring Boot
        });
    };

    // Abrir el diálogo para editar un evento
    const openEditEventDialog = (event) => {
        setSelectedEvent(event);
        setNewEvent({
            title: event.title,
            description: event.extendedProps?.description || "",
            // Compatibilidad con ambos backends (Laravel y Spring Boot)
            start_time: new Date(event.startTime || event.start_time), // Convertir a fecha local
            end_time: (event.endTime || event.end_time) ? new Date(event.endTime || event.end_time) : null, // Convertir a fecha local
            visibility: event.extendedProps?.visibility || "PRIVATE",
        });
        setEditEventDialogVisible(true);
    };

    // Cerrar el diálogo para editar un evento
    const closeEditEventDialog = () => {
        setEditEventDialogVisible(false);
        setSelectedEvent(null);
        setNewEvent({ 
            title: "", 
            description: "", 
            start_time: null, 
            end_time: null,
            visibility: "PRIVATE" // Valor predeterminado para Spring Boot
        });
    };

    // Abrir el modal de eventos
    const openEventsModal = () => {
        setEventsModalVisible(true);
    };

    // Cerrar el modal de eventos
    const closeEventsModal = () => {
        setEventsModalVisible(false);
    };

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    // Función para formatear fechas en la zona horaria local
    const formatDateForBackend = (date) => {
        if (!date) return null;
        // Ajusta la fecha a la zona horaria local antes de formatearla
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        // Formato ISO para Spring Boot: YYYY-MM-DDTHH:MM:SS.sssZ
        return localDate.toISOString();
    };

    // Guardar un nuevo evento
    const saveEvent = async () => {
        if (!newEvent.title || !newEvent.start_time) {
            alert("Por favor, completa el título y la fecha de inicio del evento.");
            return;
        }
        try {
            // Adaptar los datos para el backend de Spring Boot
            const eventData = {
                title: newEvent.title,
                description: newEvent.description,
                // Usar los nombres de propiedades que espera Spring Boot
                startTime: formatDateForBackend(newEvent.start_time),
                endTime: newEvent.end_time ? formatDateForBackend(newEvent.end_time) : null,
                visibility: newEvent.visibility || "PRIVATE",
            };
            console.log("Datos enviados al backend:", eventData); // Depuración
            await api.createEvent(eventData);
            fetchEvents();
            closeEventDialog();
        } catch (error) {
            console.error("Error al guardar el evento:", error);
            if (error.response && error.response.data) {
                // Mostrar errores de validación específicos
                console.log("Respuesta del servidor:", error.response.data); // Depuración
                let errorMessage = "Error al guardar el evento:\n";
                if (typeof error.response.data === "object") {
                    for (const key in error.response.data) {
                        errorMessage += `${key}: ${error.response.data[key]}\n`;
                    }
                } else {
                    errorMessage += error.response.data;
                }
                alert(errorMessage);
            } else {
                alert("Ocurrió un error al guardar el evento.");
            }
        }
    };

    // Actualizar un evento existente
    const updateEvent = async () => {
        if (!newEvent.title || !newEvent.start_time) {
            alert("Por favor, completa el título y la fecha de inicio del evento.");
            return;
        }
        try {
            // Adaptar los datos para el backend de Spring Boot
            const eventData = {
                id: selectedEvent.id,
                title: newEvent.title,
                description: newEvent.description,
                // Usar los nombres de propiedades que espera Spring Boot
                startTime: formatDateForBackend(newEvent.start_time),
                endTime: newEvent.end_time ? formatDateForBackend(newEvent.end_time) : null,
                visibility: newEvent.visibility || "PRIVATE",
            };
            console.log("Datos enviados al backend:", eventData); // Depuración
            await api.updateEvent(selectedEvent.id, eventData);
            fetchEvents();
            closeEditEventDialog();
        } catch (error) {
            console.error("Error al actualizar el evento:", error);
            if (error.response && error.response.data) {
                // Mostrar errores de validación específicos
                const errors = error.response.data.errors || error.response.data;
                let errorMessage = "Errores de validación:\n";
                for (const key in errors) {
                    errorMessage += `${key}: ${errors[key]}\n`;
                }
                alert(errorMessage);
            } else {
                alert("Ocurrió un error al actualizar el evento.");
            }
        }
    };

    // Eliminar un evento
    const deleteEvent = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        console.log("Token de autenticación:", token); // Depuración
        console.log("ID del evento a eliminar:", selectedEvent.id); // Depuración

        try {
            const response = await api.deleteEvent(selectedEvent.id);
            console.log("Respuesta del servidor:", response.data); // Depuración
            fetchEvents();
            closeEditEventDialog();
        } catch (error) {
            console.error("Error al eliminar el evento:", error);
            if (error.response && error.response.data) {
                console.log("Respuesta del servidor:", error.response.data); // Depuración
                let errorMessage = "Error al eliminar el evento:\n";
                if (typeof error.response.data === "object") {
                    for (const key in error.response.data) {
                        errorMessage += `${key}: ${error.response.data[key]}\n`;
                    }
                } else {
                    errorMessage += error.response.data;
                }
                alert(errorMessage);
            } else {
                alert("Ocurrió un error al eliminar el evento.");
            }
        }
    };

    return (
        <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
            <div className="banner">
                <Button
                    icon={`pi pi-align-justify`}
                    onClick={() => setSidebarVisible(!sidebarVisible)}
                    className="p-button-text p-button-plain"
                    style={{ color: "white", marginRight: "auto" }}
                />
                <span>Agenda Personal</span>
                <Button
                    icon={darkMode ? "pi pi-sun" : "pi pi-moon"}
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-button-text p-button-plain"
                    style={{ color: "white", marginLeft: "10px" }}
                />
                <Button
                    label="Ver Eventos"
                    icon="pi pi-list"
                    onClick={openEventsModal}
                    style={{ marginLeft: "10px" }}
                />
                <Button
                    label="Crear Evento"
                    icon="pi pi-plus"
                    onClick={openEventDialog}
                    style={{ marginLeft: "10px" }}
                />
                <Button
                    label="Amigos"
                    icon="pi pi-users"
                    onClick={() => setFriendRequestMenuVisible(true)}
                    style={{ marginLeft: "10px" }}
                />
                <Button
                    label="Cerrar Sesión"
                    icon="pi pi-sign-out"
                    onClick={logout}
                    style={{ marginLeft: "10px" }}
                />
            </div>

            <EventDialog
                visible={eventDialogVisible}
                onHide={closeEventDialog}
                event={newEvent}
                onChange={handleInputChange}
                onSave={saveEvent}
                isEdit={false}
            />
            <EventDialog
                visible={editEventDialogVisible}
                onHide={closeEditEventDialog}
                event={newEvent}
                onChange={handleInputChange}
                onSave={updateEvent}
                onDelete={deleteEvent}
                isEdit={true}
            />

            <EventsModal
                visible={eventsModalVisible}
                onHide={closeEventsModal}
                events={events}
                onEventClick={openEditEventDialog}
            />

            <FriendRequestMenu
                visible={friendRequestMenuVisible}
                onHide={() => setFriendRequestMenuVisible(false)}
            />

            <div className="main-content">
                {sidebarVisible && <ContactSidebar />} {/* Usa tu componente existente */}
                <div className="calendar-container">
                    <CalendarComponent
                        events={events}
                        onEventClick={openEditEventDialog}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarApp;
