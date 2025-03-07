import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const CalendarComponent = ({ events, onEventClick }) => {
  return (
    <div className="calendar-component">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // Vista inicial: mes
        locale={esLocale} // Configura el calendario en español
        events={events} // Pasa los eventos desde el componente padre
        height="auto" // Ajusta la altura automáticamente
        contentHeight="600px" // Limita la altura del contenido
        slotMinTime="08:00:00" // Hora mínima visible
        slotMaxTime="23:00:00" // Hora máxima visible
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay", // Botones para cambiar vistas
        }}
        eventClick={(info) => {
          const event = {
            ...info.event, // Propiedades del evento
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            description: info.event.extendedProps.description, // Propiedades adicionales
          };
          onEventClick(event); // Pasa el evento al componente padre
        }}
      />
    </div>
  );
};

export default CalendarComponent;