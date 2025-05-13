import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import * as yup from "yup";

const ContactSidebar = () => {
  const [contacts, setContacts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendEvents, setFriendEvents] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [editContact, setEditContact] = useState(null);
  const [editFriend, setEditFriend] = useState(null);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleFriendDialog, setVisibleFriendDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [newFriend, setNewFriend] = useState({
    description: "",
    phone: "",
  });
  const toast = useRef(null);

  // Esquema de validación con Yup
  const contactSchema = yup.object().shape({
    name: yup.string().required("El nombre es obligatorio."),
    email: yup.string().email("Correo electrónico inválido.").required("El correo electrónico es obligatorio."),
    phone: yup.string().max(10, "El número de teléfono debe tener máximo 10 dígitos.").optional(),
    notes: yup.string().optional(),
  });

  // Obtener contactos y amigos al cargar el componente
  useEffect(() => {
    fetchContacts();
    fetchFriends();
  }, []);

  // Función para obtener contactos
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.getContacts();

      // Verifica si la respuesta tiene datos y es un array
      if (response.data && Array.isArray(response.data)) {
        setContacts(response.data); // Usa response.data directamente
      } else {
        console.error("La respuesta de la API no es un array:", response.data);
        setContacts([]); // Asignar un array vacío si la respuesta no es válida
      }
    } catch (error) {
      console.error("Error al cargar contactos:", error);
      showError("Error al cargar contactos.");
      setContacts([]); // Asignar un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

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

  // Función para obtener eventos de un amigo
  const fetchFriendEvents = async (friendId) => {
    setLoadingEvents(true);
    try {
      // Obtener eventos del amigo usando el nuevo método específico
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);

      const response = await api.getFriendEvents(friendId, start, end);

      // Verificar que la respuesta es un array
      if (response.data && Array.isArray(response.data)) {
        setFriendEvents(response.data);
      } else {
        console.error("La respuesta de la API no es un array:", response.data);
        setFriendEvents([]);
      }
      setSelectedFriend(friendId);
    } catch (error) {
      console.error("Error al cargar eventos del amigo:", error);
      showError("Error al cargar eventos del amigo.");
      setFriendEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Manejar cambios en los campos del formulario de contactos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en los campos del formulario de amigos
  const handleFriendInputChange = (e) => {
    const { name, value } = e.target;
    setNewFriend((prev) => ({ ...prev, [name]: value }));
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

  // Guardar o actualizar un contacto
  const saveContact = async () => {
    try {
      await contactSchema.validate(newContact, { abortEarly: false });

      console.log("Datos a enviar:", newContact); // Verifica los datos antes de enviar

      let response;
      if (editContact) {
        response = await api.updateContact(editContact.id, newContact);
        showSuccess("Contacto actualizado correctamente.");
      } else {
        response = await api.createContact(newContact);
        showSuccess("Contacto creado correctamente.");
      }

      // Actualizar el estado `contacts` con el nuevo contacto
      if (response.data) {
        setContacts((prevContacts) => {
          if (editContact) {
            // Si es una edición, reemplaza el contacto existente
            return prevContacts.map((contact) =>
              contact.id === editContact.id ? response.data : contact
            );
          } else {
            // Si es un nuevo contacto, agrégalo al estado
            return [...prevContacts, response.data];
          }
        });
      }

      setVisibleDialog(false);
      setNewContact({ name: "", email: "", phone: "", notes: "" });
      setEditContact(null);
    } catch (error) {
      if (error.name === "ValidationError") {
        error.inner.forEach((err) => {
          showError(err.message);
        });
      } else if (error.response && error.response.status === 422) {
        // Manejar errores de validación del servidor
        const { errors } = error.response.data;
        if (errors.email) {
          showError(errors.email[0]); // Mostrar el mensaje de error del servidor
        } else {
          showError("Error de validación en el servidor.");
        }
      } else {
        console.error("Error al guardar el contacto:", error);
        showError("Error al guardar el contacto.");
      }
    }
  };

  // Abrir diálogo para editar un contacto
  const openEditDialog = (contact) => {
    setEditContact(contact);
    setNewContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      notes: contact.notes,
    });
    setVisibleDialog(true);
  };

  // Abrir diálogo para editar un amigo
  const openEditFriendDialog = (friend) => {
    setEditFriend(friend);
    setNewFriend({
      description: friend.description || "",
      phone: friend.phone || "",
    });
    setVisibleFriendDialog(true);
  };

  // Eliminar un contacto
  const deleteContact = async (id) => {
    try {
      await api.deleteContact(id);
      fetchContacts(); // Recargar la lista de contactos
      showSuccess("Contacto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
      showError("Error al eliminar el contacto.");
    }
  };

  // Guardar o actualizar un amigo
  const saveFriend = async () => {
    try {
      // Validar que el número de teléfono no tenga más de 10 dígitos
      if (newFriend.phone && newFriend.phone.length > 10) {
        showError("El número de teléfono debe tener máximo 10 dígitos.");
        return;
      }

      const response = await api.updateFriend(editFriend.id, newFriend);

      if (response.data) {
        // Actualizar el amigo en la lista de amigos
        setFriends((prevFriends) => {
          return prevFriends.map((friend) =>
            friend.id === editFriend.id ? { ...friend, ...newFriend } : friend
          );
        });

        showSuccess("Amigo actualizado correctamente.");
      }

      setVisibleFriendDialog(false);
      setNewFriend({ description: "", phone: "" });
      setEditFriend(null);

      // Recargar la lista de amigos para asegurar que los cambios se reflejen
      fetchFriends();
    } catch (error) {
      console.error("Error al guardar el amigo:", error);
      showError("Error al guardar el amigo.");
    }
  };

  return (
    <div className="sidebar">
      <Toast ref={toast} />
      <h3>Contactos y Amigos</h3>

      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
        <TabPanel header="Contactos">
          <Button
            label="Nuevo Contacto"
            icon="pi pi-plus"
            onClick={() => {
              setEditContact(null);
              setNewContact({ name: "", email: "", phone: "", notes: "" });
              setVisibleDialog(true);
            }}
            className="p-button-sm"
            style={{ marginBottom: "10px" }}
          />

          {loading ? (
            <p>Cargando contactos...</p>
          ) : (
            <div className="contact-cards">
              {contacts.map((contact) => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-info">
                    <strong>{contact.name}</strong>
                    <p>{contact.email}</p>
                    <p>{contact.phone}</p>
                    <p>{contact.notes}</p>
                  </div>
                  <div className="contact-actions">
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text"
                      onClick={() => openEditDialog(contact)}
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-text"
                      onClick={() => deleteContact(contact.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabPanel>

        <TabPanel header="Amigos">
          {loadingFriends ? (
            <p>Cargando amigos...</p>
          ) : (
            <div className="friends-section">
              {friends.length === 0 ? (
                <p>No tienes amigos agregados aún.</p>
              ) : (
                <Accordion>
                  {friends.map((friend) => (
                    <AccordionTab 
                      key={friend.id} 
                      header={
                        <div className="friend-header">
                          <span>{friend.name}</span>
                          <span className="friend-email">{friend.email}</span>
                        </div>
                      }
                    >
                      <div className="friend-details">
                        <div className="friend-info">
                          {friend.description && <p><strong>Descripción:</strong> {friend.description}</p>}
                          {friend.phone && <p><strong>Teléfono:</strong> {friend.phone}</p>}
                        </div>
                        <div className="friend-actions">
                          <Button
                            icon="pi pi-pencil"
                            className="p-button-text"
                            onClick={() => openEditFriendDialog(friend)}
                            tooltip="Editar amigo"
                          />
                          <Button
                            label="Ver Eventos"
                            icon="pi pi-calendar"
                            onClick={() => fetchFriendEvents(friend.id)}
                            className="p-button-sm"
                          />
                        </div>

                        {selectedFriend === friend.id && (
                          <div className="friend-events">
                            <h4>Eventos de {friend.name}</h4>
                            {loadingEvents ? (
                              <p>Cargando eventos...</p>
                            ) : (
                              <div>
                                {friendEvents.length === 0 ? (
                                  <p>No hay eventos disponibles.</p>
                                ) : (
                                  <ul className="event-list">
                                    {friendEvents.map((event) => (
                                      <li key={event.id} className="event-item">
                                        <div className="event-title">{event.title}</div>
                                        <div className="event-time">
                                          {new Date(event.startTime || event.start_time).toLocaleString()}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </AccordionTab>
                  ))}
                </Accordion>
              )}
            </div>
          )}
        </TabPanel>
      </TabView>

      <Dialog
        header={editContact ? "Editar Contacto" : "Nuevo Contacto"}
        visible={visibleDialog}
        onHide={() => {
          setVisibleDialog(false);
          setEditContact(null);
          setNewContact({ name: "", email: "", phone: "", notes: "" });
        }}
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
            <label htmlFor="email">Correo Electrónico</label>
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
            <label htmlFor="notes">Nota</label>
            <InputText
              id="notes"
              name="notes"
              value={newContact.notes}
              onChange={handleInputChange}
            />
          </div>
          <Button
            label={editContact ? "Actualizar" : "Guardar"}
            onClick={saveContact}
          />
        </div>
      </Dialog>

      {/* Diálogo para editar amigos */}
      <Dialog
        header="Editar Amigo"
        visible={visibleFriendDialog}
        onHide={() => {
          setVisibleFriendDialog(false);
          setEditFriend(null);
          setNewFriend({ description: "", phone: "" });
        }}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="description">Descripción</label>
            <InputText
              id="description"
              name="description"
              value={newFriend.description}
              onChange={handleFriendInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="phone">Teléfono</label>
            <InputText
              id="phone"
              name="phone"
              value={newFriend.phone}
              onChange={handleFriendInputChange}
              maxLength={10}
            />
            <small>Máximo 10 dígitos</small>
          </div>
          <Button
            label="Actualizar"
            onClick={saveFriend}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ContactSidebar;
