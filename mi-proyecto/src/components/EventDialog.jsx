import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";

const EventDialog = ({ visible, onHide, event, onChange, onSave, onDelete, isEdit }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ target: { name, value } });
    };

    const handleDateChange = (name, value) => {
        onChange({ target: { name, value } });
    };

    const categories = [
        { label: "Trabajo", value: "work" },
        { label: "Personal", value: "personal" },
        { label: "Reunión", value: "meeting" },
    ];

    return (
        <Dialog
            header={isEdit ? "Editar Evento" : "Crear Evento"}
            visible={visible}
            onHide={onHide}
            className="event-dialog"
            modal
        >
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="title">Título</label>
                    <InputText
                        id="title"
                        name="title"
                        value={event.title || ""}
                        onChange={handleInputChange}
                        placeholder="Ingresa el título del evento"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="description">Descripción</label>
                    <InputText
                        id="description"
                        name="description"
                        value={event.description || ""}
                        onChange={handleInputChange}
                        placeholder="Ingresa una descripción"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="category">Categoría</label>
                    <Dropdown
                        id="category"
                        name="category"
                        value={event.category || ""}
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
                        value={event.start_time || null}
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
                        value={event.end_time || null}
                        onChange={(e) => handleDateChange("end_time", e.value)}
                        showTime
                        hourFormat="24"
                        dateFormat="dd/mm/yy"
                        placeholder="Selecciona la fecha de finalización"
                    />
                </div>
                <div className="p-field">
                    <label className="p-mb-2">Visibilidad</label>
                    <div className="p-formgroup-inline">
                        <div className="p-field-radiobutton">
                            <RadioButton 
                                inputId="visibility1" 
                                name="visibility" 
                                value="PRIVATE" 
                                onChange={handleInputChange} 
                                checked={event.visibility === "PRIVATE"} 
                            />
                            <label htmlFor="visibility1">Privado</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton 
                                inputId="visibility2" 
                                name="visibility" 
                                value="FRIENDS_ONLY" 
                                onChange={handleInputChange} 
                                checked={event.visibility === "FRIENDS_ONLY"} 
                            />
                            <label htmlFor="visibility2">Solo amigos</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton 
                                inputId="visibility3" 
                                name="visibility" 
                                value="PUBLIC" 
                                onChange={handleInputChange} 
                                checked={event.visibility === "PUBLIC"} 
                            />
                            <label htmlFor="visibility3">Público</label>
                        </div>
                    </div>
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

export default EventDialog;
