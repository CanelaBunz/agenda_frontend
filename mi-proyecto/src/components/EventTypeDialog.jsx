import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const EventTypeDialog = ({ visible, onHide, onSelectType }) => {
    return (
        <Dialog
            header="¿Qué deseas crear?"
            visible={visible}
            onHide={onHide}
            className="event-type-dialog"
            modal
        >
            <div className="p-d-flex p-jc-center p-ai-center" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Button
                    label="Crear Evento"
                    icon="pi pi-calendar-plus"
                    onClick={() => onSelectType('event')}
                    className="p-button-lg"
                    style={{ width: '100%', margin: '0.5rem 0' }}
                />
                <Button
                    label="Crear Itinerario"
                    icon="pi pi-list"
                    onClick={() => onSelectType('itinerary')}
                    className="p-button-lg"
                    style={{ width: '100%', margin: '0.5rem 0' }}
                />
            </div>
        </Dialog>
    );
};

export default EventTypeDialog;