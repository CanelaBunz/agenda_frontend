import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const CalendarComponent = ({ events, onEventClick }) => {
    // Transformar los eventos al formato que FullCalendar espera
    const formattedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        // Compatibilidad con ambos backends (Laravel y Spring Boot)
        start: event.startTime || event.start_time,
        end: event.endTime || event.end_time,
        extendedProps: {
            description: event.description || "",
            category: event.category || "",
            visibility: event.visibility || "PRIVATE",
        },
    }));

    return (
        <div className="calendar-component">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                events={formattedEvents}
                height="auto"
                contentHeight="600px"
                slotMinTime="08:00:00"
                slotMaxTime="23:00:00"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                eventContent={(eventInfo) => (
                    <div style={{ backgroundColor: eventInfo.event.extendedProps.color }}>
                        {eventInfo.event.title}
                    </div>
                )}
                eventClick={(info) => {
                    const event = {
                        id: info.event.id,
                        title: info.event.title,
                        start_time: info.event.start, // Fecha de inicio (UTC)
                        end_time: info.event.end, // Fecha de finalización (UTC)
                        description: info.event.extendedProps.description,
                        category: info.event.extendedProps.category,
                    };
                    onEventClick(event); // Pasa el evento al componente padre
                }}
            />
        </div>
    );
};

export default CalendarComponent;
