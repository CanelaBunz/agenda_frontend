import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ContactSidebar = () => {
  const [contacts, setContacts] = useState([]);
  const [contactDialogVisible, setContactDialogVisible] = useState(false);
  const [editContactDialogVisible, setEditContactDialogVisible] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [editingContact, setEditingContact] = useState(null);

  // Abrir modal para crear contacto
  const openContactDialog = () => {
    setContactDialogVisible(true);
  };

  // Cerrar modal para crear contacto
  const closeContactDialog = () => {
    setContactDialogVisible(false);
    setNewContact({ name: "", email: "", phone: "", note: "" });
  };

  // Abrir modal para editar contacto
  const openEditContactDialog = (contact) => {
    setEditingContact(contact);
    setEditContactDialogVisible(true);
  };

  // Cerrar modal para editar contacto
  const closeEditContactDialog = () => {
    setEditContactDialogVisible(false);
    setEditingContact(null);
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en los campos del formulario de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingContact((prev) => ({ ...prev, [name]: value }));
  };

  // Validar email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Guardar nuevo contacto
  const saveContact = () => {
    if (!newContact.name || !newContact.email) {
      alert("Por favor, completa al menos el nombre y el email del contacto.");
      return;
    }

    if (!validateEmail(newContact.email)) {
      alert("Por favor, introduce un email válido.");
      return;
    }

    const contact = {
      ...newContact,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setContacts((prev) => [...prev, contact]);
    closeContactDialog();
  };

  // Actualizar contacto existente
  const updateContact = () => {
    if (!editingContact.name || !editingContact.email) {
      alert("Por favor, completa al menos el nombre y el email del contacto.");
      return;
    }

    if (!validateEmail(editingContact.email)) {
      alert("Por favor, introduce un email válido.");
      return;
    }

    const updatedContacts = contacts.map((contact) =>
      contact.created_at === editingContact.created_at
        ? { ...editingContact, updated_at: new Date().toISOString() }
        : contact
    );
    setContacts(updatedContacts);
    closeEditContactDialog();
  };

  // Eliminar contacto
  const deleteContact = (contactToDelete) => {
    const updatedContacts = contacts.filter(
      (contact) => contact.created_at !== contactToDelete.created_at
    );
    setContacts(updatedContacts);
  };

  return (
    <div className="contact-sidebar">
      <h3>Contactos</h3>

      {/* Botón para crear contacto */}
      <Button
        label="Crear Contacto"
        icon="pi pi-plus"
        onClick={openContactDialog}
        className="p-button-sm"
        style={{ marginBottom: "10px" }}
      />

      {/* Lista de contactos */}
      <ul>
        {contacts.map((contact, index) => (
          <li
            key={index}
            onClick={() => openEditContactDialog(contact)}
            style={{ cursor: "pointer" }}
          >
            <strong>{contact.name}</strong>
            <p>Email: {contact.email}</p>
            <p>Teléfono: {contact.phone}</p>
            <p>Nota: {contact.note}</p>
            <Button
              label="Eliminar"
              icon="pi pi-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteContact(contact);
              }}
              className="p-button-danger p-button-sm"
            />
          </li>
        ))}
      </ul>

      {/* Modal para crear contacto */}
      <Dialog
        header="Crear Contacto"
        visible={contactDialogVisible}
        onHide={closeContactDialog}
        style={{ width: "400px" }}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText
              id="name"
              name="name"
              value={newContact.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              name="email"
              value={newContact.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="phone">Teléfono</label>
            <InputText
              id="phone"
              name="phone"
              value={newContact.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="note">Nota</label>
            <InputText
              id="note"
              name="note"
              value={newContact.note}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={closeContactDialog}
            className="p-button-text"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            onClick={saveContact}
            autoFocus
          />
        </div>
      </Dialog>

      {/* Modal para editar contacto */}
      <Dialog
        header="Editar Contacto"
        visible={editContactDialogVisible}
        onHide={closeEditContactDialog}
        style={{ width: "400px" }}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText
              id="name"
              name="name"
              value={editingContact?.name || ""}
              onChange={handleEditInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              name="email"
              value={editingContact?.email || ""}
              onChange={handleEditInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="phone">Teléfono</label>
            <InputText
              id="phone"
              name="phone"
              value={editingContact?.phone || ""}
              onChange={handleEditInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="note">Nota</label>
            <InputText
              id="note"
              name="note"
              value={editingContact?.note || ""}
              onChange={handleEditInputChange}
            />
          </div>
        </div>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={closeEditContactDialog}
            className="p-button-text"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            onClick={updateContact}
            autoFocus
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ContactSidebar;