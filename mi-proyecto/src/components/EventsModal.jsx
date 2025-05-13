import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button, InputText, Dropdown } from "primereact";
import { Accordion, AccordionTab } from "primereact/accordion";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import api from "../services/api";

const EventsModal = ({ visible, onHide, events, itineraries, eventToItineraryMap, onEventClick }) => {
    const [filter, setFilter] = useState("");
    const [sortBy, setSortBy] = useState("start_time");
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [sendingRequest, setSendingRequest] = useState(false);

    const shareOverlayPanel = React.useRef(null);
    const toast = React.useRef(null);

    // Cargar amigos cuando el componente se monta
    useEffect(() => {
        if (visible) {
            fetchFriends();
        }
    }, [visible]);

    // Función para obtener amigos
    const fetchFriends = async () => {
        setLoadingFriends(true);
        try {
            const response = await api.getFriends();
            if (response.data) {
                setFriends(response.data);
            } else {
                console.error("La respuesta de la API no es válida:", response.data);
                setFriends([]);
            }
        } catch (error) {
            console.error("Error al cargar amigos:", error);
            showError("Error al cargar amigos.");
            setFriends([]);
        } finally {
            setLoadingFriends(false);
        }
    };

    // Función para mostrar el panel de compartir evento
    const showSharePanel = (event, e) => {
        setSelectedEvent(event);
        shareOverlayPanel.current.toggle(e);
    };

    // Función para enviar una solicitud de evento a un amigo
    const sendEventRequest = async (friendId) => {
        if (!selectedEvent || !friendId) return;

        setSendingRequest(true);
        try {
            await api.sendEventRequest(selectedEvent.id, friendId);
            showSuccess(`Invitación enviada correctamente`);
            shareOverlayPanel.current.hide();
        } catch (error) {
            console.error("Error al enviar la invitación:", error);
            showError("Error al enviar la invitación. " + (error.response?.data?.message || ""));
        } finally {
            setSendingRequest(false);
        }
    };

    // Mostrar notificaciones de éxito
    const showSuccess = (message) => {
        toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: message,
        });
    };

    // Mostrar notificaciones de error
    const showError = (message) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: message,
        });
    };

    // Filtrar eventos
    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(filter.toLowerCase())
    );

    // Ordenar eventos
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (sortBy === "start_time") {
            // Asegurarse de que las fechas son objetos Date para comparación
            const dateA = new Date(a.start_time || a.startTime);
            const dateB = new Date(b.start_time || b.startTime);
            return dateA - dateB;
        } else if (sortBy === "title") {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    // Agrupar eventos por itinerario
    const eventsInItineraries = {};
    const standaloneEvents = [];

    // Crear un mapa de itinerarios por ID para acceso rápido
    const itinerariesById = {};
    if (itineraries && itineraries.length > 0) {
        itineraries.forEach(itinerary => {
            itinerariesById[itinerary.id] = itinerary;
        });
    }

    // Clasificar eventos
    sortedEvents.forEach(event => {
        const itineraryId = eventToItineraryMap[event.id];
        if (itineraryId && itinerariesById[itineraryId]) {
            if (!eventsInItineraries[itineraryId]) {
                eventsInItineraries[itineraryId] = {
                    itinerary: itinerariesById[itineraryId],
                    events: []
                };
            }
            eventsInItineraries[itineraryId].events.push(event);
        } else {
            standaloneEvents.push(event);
        }
    });

    return (
        <Dialog
            header="Eventos Creados"
            visible={visible}
            onHide={onHide}
            className="events-modal"
            modal
            style={{ width: '80vw', maxWidth: '800px' }}
        >
            <Toast ref={toast} />

            <OverlayPanel ref={shareOverlayPanel} showCloseIcon>
                {selectedEvent && (
                    <div className="share-panel">
                        <h3>Compartir evento: {selectedEvent.title}</h3>
                        <p>Selecciona amigos para invitar a este evento:</p>

                        {loadingFriends ? (
                            <p>Cargando amigos...</p>
                        ) : friends.length === 0 ? (
                            <p>No tienes amigos para compartir este evento.</p>
                        ) : (
                            <div className="friends-list">
                                {friends.map(friend => (
                                    <div key={friend.id} className="friend-item">
                                        <span>{friend.name}</span>
                                        <Button
                                            icon="pi pi-send"
                                            className="p-button-rounded p-button-sm"
                                            onClick={() => sendEventRequest(friend.id)}
                                            loading={sendingRequest}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </OverlayPanel>
            <div className="p-fluid">
                <div className="p-field">
                    <InputText
                        placeholder="Buscar eventos"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ marginBottom: "10px" }}
                    />
                </div>
                <div className="p-field">
                    <Dropdown
                        value={sortBy}
                        options={[
                            { label: "Ordenar por fecha", value: "start_time" },
                            { label: "Ordenar por título", value: "title" },
                        ]}
                        onChange={(e) => setSortBy(e.value)}
                        placeholder="Ordenar por"
                        style={{ marginBottom: "10px" }}
                    />
                </div>

                {/* Mostrar itinerarios con sus eventos en pestañas colapsables */}
                {Object.values(eventsInItineraries).length > 0 && (
                    <div className="itineraries-section">
                        <h2>Itinerarios</h2>
                        <Accordion multiple>
                            {Object.values(eventsInItineraries).map(({ itinerary, events }) => (
                                <AccordionTab 
                                    key={itinerary.id} 
                                    header={
                                        <div>
                                            <h3>{itinerary.title}</h3>
                                            <p>{itinerary.description}</p>
                                            <p>
                                                <strong>Inicio:</strong> {new Date(itinerary.start_time || itinerary.startTime).toLocaleString()}
                                            </p>
                                            <p>
                                                <strong>Fin:</strong> {itinerary.end_time || itinerary.endTime ? new Date(itinerary.end_time || itinerary.endTime).toLocaleString() : "No definido"}
                                            </p>
                                        </div>
                                    }
                                >
                                    {events.map((event) => (
                                        <div key={event.id} className="event-item">
                                            <h4>{event.title}</h4>
                                            <p>{event.description}</p>
                                            <p>
                                                <strong>Inicio:</strong> {new Date(event.start_time || event.startTime).toLocaleString()}
                                            </p>
                                            <p>
                                                <strong>Fin:</strong> {event.end_time || event.endTime ? new Date(event.end_time || event.endTime).toLocaleString() : "No definido"}
                                            </p>
                                            <Button
                                                label="Editar"
                                                icon="pi pi-pencil"
                                                onClick={() => onEventClick(event)}
                                                className="p-button-text"
                                                style={{ marginRight: "10px" }}
                                            />
                                            <Button
                                                label="Compartir"
                                                icon="pi pi-share-alt"
                                                onClick={(e) => showSharePanel(event, e)}
                                                className="p-button-text"
                                                style={{ marginRight: "10px" }}
                                            />
                                        </div>
                                    ))}
                                </AccordionTab>
                            ))}
                        </Accordion>
                    </div>
                )}

                {/* Mostrar eventos independientes */}
                {standaloneEvents.length > 0 && (
                    <div className="standalone-events-section">
                        <h2>Eventos Independientes</h2>
                        {standaloneEvents.map((event) => (
                            <div key={event.id} className="event-item">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <p>
                                    <strong>Inicio:</strong> {new Date(event.start_time || event.startTime).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Fin:</strong> {event.end_time || event.endTime ? new Date(event.end_time || event.endTime).toLocaleString() : "No definido"}
                                </p>
                                <Button
                                    label="Editar"
                                    icon="pi pi-pencil"
                                    onClick={() => onEventClick(event)}
                                    className="p-button-text"
                                    style={{ marginRight: "10px" }}
                                />
                                <Button
                                    label="Compartir"
                                    icon="pi pi-share-alt"
                                    onClick={(e) => showSharePanel(event, e)}
                                    className="p-button-text"
                                    style={{ marginRight: "10px" }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default EventsModal;
