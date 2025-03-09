import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button, InputText, Dropdown } from "primereact";

const EventsModal = ({ visible, onHide, events, onEventClick }) => {
    const [filter, setFilter] = useState("");
    const [sortBy, setSortBy] = useState("start_time");

    // Filtrar eventos
    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(filter.toLowerCase())
    );

    // Ordenar eventos
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (sortBy === "start_time") {
            return new Date(a.start_time) - new Date(b.start_time);
        } else if (sortBy === "title") {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    return (
        <Dialog
            header="Eventos Creados"
            visible={visible}
            onHide={onHide}
            className="events-modal"
            modal
        >
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
                {sortedEvents.map((event) => (
                    <div key={event.id} className="event-item">
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p>
                            <strong>Inicio:</strong> {new Date(event.start_time).toLocaleString()}
                        </p>
                        <p>
                            <strong>Fin:</strong> {event.end_time ? new Date(event.end_time).toLocaleString() : "No definido"}
                        </p>
                        <Button
                            label="Editar"
                            icon="pi pi-pencil"
                            onClick={() => onEventClick(event)}
                            className="p-button-text"
                            style={{ marginRight: "10px" }}
                        />
                    </div>
                ))}
            </div>
        </Dialog>
    );
};

export default EventsModal;