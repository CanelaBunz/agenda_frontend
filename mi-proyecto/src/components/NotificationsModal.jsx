import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const NotificationsModal = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button label="Mostrar Notificaciones" onClick={() => setVisible(true)} />
      <Dialog
        header="Notificaciones"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: '50vw' }}
      >
        <p>Aquí van las notificaciones...</p>
      </Dialog>
    </>
  );
};

export default NotificationsModal;