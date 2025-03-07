import React, { useState } from "react";
import ContactSidebar from "../components/ContactSidebar";
import CalendarComponent from "../components/CalendarComponent";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles.css";

const CalendarApp = ({ onLogout }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventDialogVisible, setEventDialogVisible] = useState(false);
  const [editEventDialogVisible, setEditEventDialogVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: null,
    end: null,
  });

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openEventDialog = () => {
    setEventDialogVisible(true);
  };

  const closeEventDialog = () => {
    setEventDialogVisible(false);
    setNewEvent({ title: "", description: "", start: null, end: null });
  };

  const openEditEventDialog = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      description: event.extendedProps?.description || "",
      start: new Date(event.start),
      end: event.end ? new Date(event.end) : null,
    });
    setEditEventDialogVisible(true);
  };

  const closeEditEventDialog = () => {
    setEditEventDialogVisible(false);
    setSelectedEvent(null);
    setNewEvent({ title: "", description: "", start: null, end: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartDateChange = (e) => {
    setNewEvent((prev) => ({ ...prev, start: e.value }));
  };

  const handleEndDateChange = (e) => {
    setNewEvent((prev) => ({ ...prev, end: e.value }));
  };

  const saveEvent = () => {
    if (newEvent.title && newEvent.start) {
      const event = {
        title: newEvent.title,
        start: newEvent.start.toISOString(),
        end: newEvent.end ? newEvent.end.toISOString() : null,
        extendedProps: {
          description: newEvent.description,
        },
      };
      setEvents((prev) => [...prev, event]);
      closeEventDialog();
    } else {
      alert("Por favor, completa el título y la fecha de inicio del evento.");
    }
  };

  const updateEvent = () => {
    if (newEvent.title && newEvent.start) {
      const updatedEvents = events.map((event) =>
        event === selectedEvent
          ? {
              ...newEvent,
              start: newEvent.start.toISOString(),
              end: newEvent.end ? newEvent.end.toISOString() : null,
              extendedProps: {
                description: newEvent.description,
              },
            }
          : event
      );
      setEvents([...updatedEvents]);
      closeEditEventDialog();
    } else {
      alert("Por favor, completa el título y la fecha de inicio del evento.");
    }
  };

  const deleteEvent = () => {
    const updatedEvents = events.filter((event) => event !== selectedEvent);
    setEvents([...updatedEvents]);
    closeEditEventDialog();
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="banner">
        <Button
          icon={`pi pi-align-justify`}
          onClick={toggleSidebar}
          className="p-button-text p-button-plain"
          style={{ color: "white", marginRight: "auto" }}
        />
        <span>Agenda Personal</span>
        <Button
          icon={darkMode ? "pi pi-sun" : "pi pi-moon"}
          onClick={toggleDarkMode}
          className="p-button-text p-button-plain"
          style={{ color: "white", marginLeft: "auto" }}
        />
        <Button
          label="Crear Evento"
          icon="pi pi-plus"
          onClick={openEventDialog}
          style={{ marginLeft: "10px" }}
        />
        <Button
          label="Cerrar Sesión"
          icon="pi pi-sign-out"
          onClick={onLogout}
          style={{ marginLeft: "10px" }}
        />
      </div>

      <Dialog
        header="Crear Evento"
        visible={eventDialogVisible}
        onHide={closeEventDialog}
        style={{ width: "400px" }}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="title">Título</label>
            <InputText
              id="title"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Descripción</label>
            <InputText
              id="description"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="start">Fecha de inicio</label>
            <Calendar
              id="start"
              name="start"
              value={newEvent.start}
              onChange={handleStartDateChange}
              showTime
              hourFormat="24"
              dateFormat="dd/mm/yy"
            />
          </div>
          <div className="p-field">
            <label htmlFor="end">Fecha de finalización</label>
            <Calendar
              id="end"
              name="end"
              value={newEvent.end}
              onChange={handleEndDateChange}
              showTime
              hourFormat="24"
              dateFormat="dd/mm/yy"
            />
          </div>
        </div>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={closeEventDialog}
            className="p-button-text"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            onClick={saveEvent}
            autoFocus
          />
        </div>
      </Dialog>

      <Dialog
        header="Editar Evento"
        visible={editEventDialogVisible}
        onHide={closeEditEventDialog}
        style={{ width: "400px" }}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="title">Título</label>
            <InputText
              id="title"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Descripción</label>
            <InputText
              id="description"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="start">Fecha de inicio</label>
            <Calendar
              id="start"
              name="start"
              value={newEvent.start}
              onChange={handleStartDateChange}
              showTime
              hourFormat="24"
              dateFormat="dd/mm/yy"
            />
          </div>
          <div className="p-field">
            <label htmlFor="end">Fecha de finalización</label>
            <Calendar
              id="end"
              name="end"
              value={newEvent.end}
              onChange={handleEndDateChange}
              showTime
              hourFormat="24"
              dateFormat="dd/mm/yy"
            />
          </div>
        </div>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Button
            label="Eliminar"
            icon="pi pi-trash"
            onClick={deleteEvent}
            className="p-button-danger"
          />
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={closeEditEventDialog}
            className="p-button-text"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            onClick={updateEvent}
            autoFocus
          />
        </div>
      </Dialog>

      <div className="main-content">
        {sidebarVisible && <ContactSidebar />}
        <div className="calendar-container">
          <CalendarComponent events={events} onEventClick={openEditEventDialog} />
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;