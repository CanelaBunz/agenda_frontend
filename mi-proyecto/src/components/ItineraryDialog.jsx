import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";

const ItineraryDialog = ({ visible, onHide, itinerary, onChange, onSave, onDelete, isEdit }) => {
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        start_time: null,
        end_time: null,
        visibility: "PRIVATE"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ target: { name, value } });
    };

    const handleDateChange = (name, value) => {
        onChange({ target: { name, value } });
    };

    const handleEventInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleEventDateChange = (name, value) => {
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const addEvent = () => {
        if (!newEvent.title || !newEvent.start_time) {
            alert("Por favor, completa al menos el título y la fecha de inicio del evento.");
            return;
        }

        // Añadir el evento al itinerario
        const updatedEvents = [...(itinerary.events || []), { ...newEvent }];
        onChange({ target: { name: "events", value: updatedEvents } });

        // Limpiar el formulario de evento
        setNewEvent({
            title: "",
            description: "",
            start_time: null,
            end_time: null,
            visibility: "PRIVATE"
        });
    };

    const removeEvent = (index) => {
        const updatedEvents = [...itinerary.events];
        updatedEvents.splice(index, 1);
        onChange({ target: { name: "events", value: updatedEvents } });
    };

    const categories = [
        { label: "Viaje", value: "travel" },
        { label: "Vacaciones", value: "vacation" },
        { label: "Negocios", value: "business" },
        { label: "Personal", value: "personal" },
    ];

    // Formatear fecha para mostrar en la tabla
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleString();
    };

    // Renderizar acciones para cada evento en la tabla
    const actionBodyTemplate = (_, props) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() => removeEvent(props.rowIndex)}
            />
        );
    };

    return (
        <Dialog
            header={isEdit ? "Editar Itinerario" : "Crear Itinerario"}
            visible={visible}
            onHide={onHide}
            className="itinerary-dialog"
            modal
            style={{ width: '90%', maxWidth: '1000px' }}
        >
            <div className="p-fluid">
                <h3>Información del Itinerario</h3>
                <div className="p-field">
                    <label htmlFor="title">Título</label>
                    <InputText
                        id="title"
                        name="title"
                        value={itinerary.title || ""}
                        onChange={handleInputChange}
                        placeholder="Ingresa el título del itinerario"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="description">Descripción</label>
                    <InputTextarea
                        id="description"
                        name="description"
                        value={itinerary.description || ""}
                        onChange={handleInputChange}
                        placeholder="Ingresa una descripción"
                        rows={3}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="category">Categoría</label>
                    <Dropdown
                        id="category"
                        name="category"
                        value={itinerary.category || ""}
                        options={categories}
                        onChange={handleInputChange}
                        placeholder="Selecciona una categoría"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="start_time">Fecha de inicio</label>
                    <Calendar
                        id="start_time"
                        name="start_time"
                        value={itinerary.start_time || null}
                        onChange={(e) => handleDateChange("start_time", e.value)}
                        showTime
                        hourFormat="24"
                        dateFormat="dd/mm/yy"
                        placeholder="Selecciona la fecha de inicio"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="end_time">Fecha de finalización</label>
                    <Calendar
                        id="end_time"
                        name="end_time"
                        value={itinerary.end_time || null}
                        onChange={(e) => handleDateChange("end_time", e.value)}
                        showTime
                        hourFormat="24"
                        dateFormat="dd/mm/yy"
                        placeholder="Selecciona la fecha de finalización"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="location">Ubicación</label>
                    <InputText
                        id="location"
                        name="location"
                        value={itinerary.location || ""}
                        onChange={handleInputChange}
                        placeholder="Ingresa la ubicación"
                    />
                </div>

                <Divider />

                <h3>Eventos del Itinerario</h3>
                <p>Añade eventos que formarán parte de este itinerario:</p>

                {/* Tabla de eventos añadidos */}
                {itinerary.events && itinerary.events.length > 0 && (
                    <div className="p-field">
                        <h4>Eventos añadidos:</h4>
                        <DataTable value={itinerary.events} responsiveLayout="scroll">
                            <Column field="title" header="Título" />
                            <Column field="description" header="Descripción" />
                            <Column 
                                field="start_time" 
                                header="Inicio" 
                                body={(rowData) => formatDate(rowData.start_time)} 
                            />
                            <Column 
                                field="end_time" 
                                header="Fin" 
                                body={(rowData) => formatDate(rowData.end_time)} 
                            />
                            <Column body={actionBodyTemplate} exportable={false} style={{ width: '8rem' }} />
                        </DataTable>
                    </div>
                )}

                {/* Formulario para añadir un nuevo evento */}
                <div className="p-field">
                    <h4>Añadir nuevo evento:</h4>
                    <div className="p-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="p-field">
                            <label htmlFor="event-title">Título del Evento</label>
                            <InputText
                                id="event-title"
                                name="title"
                                value={newEvent.title}
                                onChange={handleEventInputChange}
                                placeholder="Título del evento"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="event-description">Descripción</label>
                            <InputText
                                id="event-description"
                                name="description"
                                value={newEvent.description}
                                onChange={handleEventInputChange}
                                placeholder="Descripción del evento"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="event-start_time">Inicio</label>
                            <Calendar
                                id="event-start_time"
                                name="start_time"
                                value={newEvent.start_time}
                                onChange={(e) => handleEventDateChange("start_time", e.value)}
                                showTime
                                hourFormat="24"
                                dateFormat="dd/mm/yy"
                                placeholder="Fecha de inicio"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="event-end_time">Fin</label>
                            <Calendar
                                id="event-end_time"
                                name="end_time"
                                value={newEvent.end_time}
                                onChange={(e) => handleEventDateChange("end_time", e.value)}
                                showTime
                                hourFormat="24"
                                dateFormat="dd/mm/yy"
                                placeholder="Fecha de fin"
                            />
                        </div>
                    </div>
                    <Button
                        label="Añadir Evento"
                        icon="pi pi-plus"
                        onClick={addEvent}
                        className="p-button-success"
                        style={{ marginTop: '1rem' }}
                    />
                </div>
            </div>

            <div className="p-dialog-footer">
                {isEdit && (
                    <Button
                        label="Eliminar"
                        icon="pi pi-trash"
                        onClick={onDelete}
                        className="p-button-danger"
                        style={{ marginRight: "10px" }}
                    />
                )}
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={onHide}
                    className="p-button-text"
                    style={{ marginRight: "10px" }}
                />
                <Button
                    label="Guardar"
                    icon="pi pi-check"
                    onClick={onSave}
                    autoFocus
                />
            </div>
        </Dialog>
    );
};

export default ItineraryDialog;
