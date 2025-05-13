import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Importa el AuthContext
import api from "../services/api"; // Importa tu API
import ContactSidebar from "../components/ContactSidebar";
import CalendarComponent from "../components/CalendarComponent";
import EventDialog from "../components/EventDialog";
import EventsModal from "../components/EventsModal";
import FriendRequestMenu from "../components/FriendRequestMenu";
import EventTypeDialog from "../components/EventTypeDialog";
import ItineraryDialog from "../components/ItineraryDialog";
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
    const [eventTypeDialogVisible, setEventTypeDialogVisible] = useState(false);
    const [eventDialogVisible, setEventDialogVisible] = useState(false);
    const [itineraryDialogVisible, setItineraryDialogVisible] = useState(false);
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
    const [newItinerary, setNewItinerary] = useState({
        title: "",
        description: "",
        start_time: null,
        end_time: null,
        location: "",
        visibility: "PRIVATE",
        events: [] // Array para almacenar los eventos del itinerario
    });

    // Estado para almacenar itinerarios
    const [itineraries, setItineraries] = useState([]);
    // Mapa para relacionar eventos con itinerarios
    const [eventToItineraryMap, setEventToItineraryMap] = useState({});

    // Cargar eventos e itinerarios al montar el componente
    useEffect(() => {
        fetchEventsAndItineraries();
    }, []);

    // Obtener eventos e itinerarios desde el backend
    const fetchEventsAndItineraries = async () => {
        try {
            // Calcular un rango de fechas (3 meses antes y después del mes actual)
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 4, 0);

            // Obtener eventos
            const eventsResponse = await api.getEvents(start, end);
            setEvents(eventsResponse.data);

            // Obtener itinerarios
            const itinerariesResponse = await api.getItineraries(start, end);
            setItineraries(itinerariesResponse.data);

            // Crear un mapa de eventos a itinerarios
            const eventMap = {};
            itinerariesResponse.data.forEach(itinerary => {
                if (itinerary.events && itinerary.events.length > 0) {
                    itinerary.events.forEach(eventId => {
                        eventMap[eventId] = itinerary.id;
                    });
                }
            });
            setEventToItineraryMap(eventMap);
        } catch (error) {
            console.error("Error al cargar eventos e itinerarios:", error);
        }
    };

    // Abrir el diálogo para seleccionar el tipo de creación
    const openEventTypeDialog = () => {
        setEventTypeDialogVisible(true);
    };

    // Cerrar el diálogo de selección de tipo
    const closeEventTypeDialog = () => {
        setEventTypeDialogVisible(false);
    };

    // Manejar la selección del tipo de creación
    const handleSelectType = (type) => {
        closeEventTypeDialog();
        if (type === 'event') {
            setEventDialogVisible(true);
        } else if (type === 'itinerary') {
            setItineraryDialogVisible(true);
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

    // Abrir el diálogo para crear un itinerario
    const openItineraryDialog = () => {
        setItineraryDialogVisible(true);
    };

    // Cerrar el diálogo para crear un itinerario
    const closeItineraryDialog = () => {
        setItineraryDialogVisible(false);
        setNewItinerary({ 
            title: "", 
            description: "", 
            start_time: null, 
            end_time: null,
            location: "",
            visibility: "PRIVATE", // Valor predeterminado para Spring Boot
            events: [] // Reiniciar el array de eventos
        });
    };

    // Añadir un evento al itinerario
    const addEventToItinerary = (event) => {
        setNewItinerary(prev => ({
            ...prev,
            events: [...prev.events, event]
        }));
    };

    // Eliminar un evento del itinerario
    const removeEventFromItinerary = (index) => {
        setNewItinerary(prev => ({
            ...prev,
            events: prev.events.filter((_, i) => i !== index)
        }));
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

    // Manejar cambios en los campos del formulario para eventos
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    // Manejar cambios en los campos del formulario para itinerarios
    const handleItineraryInputChange = (e) => {
        const { name, value } = e.target;
        setNewItinerary((prev) => ({ ...prev, [name]: value }));
    };

    // Función para formatear fechas en la zona horaria local
    const formatDateForBackend = (date) => {
        if (!date) return null;
        // Usar directamente toISOString() sin ajustes de zona horaria
        // para evitar problemas de validación en el backend
        return date.toISOString();
    };

    // Guardar un nuevo itinerario
    const saveItinerary = async () => {
        if (!newItinerary.title || !newItinerary.start_time) {
            alert("Por favor, completa el título y la fecha de inicio del itinerario.");
            return;
        }

        // Verificar que la fecha de fin esté presente
        if (!newItinerary.end_time) {
            alert("La fecha de fin es obligatoria. Por favor, completa este campo.");
            return;
        }

        try {
            // Primero, crear los eventos individuales si hay alguno
            const createdEventIds = [];

            // Si hay eventos en el itinerario, crearlos primero
            if (newItinerary.events && newItinerary.events.length > 0) {
                for (const event of newItinerary.events) {
                    const eventData = {
                        title: event.title,
                        description: event.description,
                        startTime: formatDateForBackend(event.start_time),
                        endTime: event.end_time ? formatDateForBackend(event.end_time) : formatDateForBackend(event.start_time),
                        visibility: event.visibility || "PRIVATE",
                    };

                    try {
                        const response = await api.createEvent(eventData);
                        if (response.data && response.data.id) {
                            createdEventIds.push(response.data.id);
                        }
                    } catch (eventError) {
                        console.error("Error al crear evento para el itinerario:", eventError);
                        // Continuar con el siguiente evento
                    }
                }
            }

            // Adaptar los datos para el backend de Spring Boot
            const itineraryData = {
                title: newItinerary.title,
                description: newItinerary.description,
                location: newItinerary.location,
                // Usar los nombres de propiedades que espera Spring Boot
                startTime: formatDateForBackend(newItinerary.start_time),
                // Si no hay fecha de fin, usar la fecha de inicio
                endTime: formatDateForBackend(newItinerary.end_time),
                visibility: newItinerary.visibility || "PRIVATE",
                eventIds: createdEventIds // Asociar los eventos creados
            };

            console.log("Datos enviados al backend:", itineraryData); // Depuración
            await api.createItinerary(itineraryData);
            fetchEventsAndItineraries(); // Recargar eventos e itinerarios
            closeItineraryDialog();
        } catch (error) {
            console.error("Error al guardar el itinerario:", error);
            if (error.response && error.response.data) {
                // Mostrar errores de validación específicos
                console.log("Respuesta del servidor:", error.response.data); // Depuración
                let errorMessage = "Error al guardar el itinerario:\n";
                if (typeof error.response.data === "object") {
                    for (const key in error.response.data) {
                        errorMessage += `${key}: ${error.response.data[key]}\n`;
                    }
                } else {
                    errorMessage += error.response.data;
                }
                alert(errorMessage);
            } else {
                alert("Ocurrió un error al guardar el itinerario.");
            }
        }
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
            fetchEventsAndItineraries();
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
            fetchEventsAndItineraries();
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
            fetchEventsAndItineraries();
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
                    label="Crear"
                    icon="pi pi-plus"
                    onClick={openEventTypeDialog}
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
                itineraries={itineraries}
                eventToItineraryMap={eventToItineraryMap}
                onEventClick={openEditEventDialog}
            />

            <FriendRequestMenu
                visible={friendRequestMenuVisible}
                onHide={() => setFriendRequestMenuVisible(false)}
            />

            <EventTypeDialog
                visible={eventTypeDialogVisible}
                onHide={closeEventTypeDialog}
                onSelectType={handleSelectType}
            />

            <ItineraryDialog
                visible={itineraryDialogVisible}
                onHide={closeItineraryDialog}
                itinerary={newItinerary}
                onChange={handleItineraryInputChange}
                onSave={saveItinerary}
                isEdit={false}
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
