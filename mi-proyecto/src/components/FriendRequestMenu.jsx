import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import * as yup from "yup";

const FriendRequestMenu = ({ visible, onHide }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    recipientEmail: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  // Esquema de validación con Yup
  const requestSchema = yup.object().shape({
    recipientEmail: yup
      .string()
      .email("Correo electrónico inválido.")
      .required("El correo electrónico es obligatorio."),
    description: yup.string().optional(),
  });

  // Cargar datos al abrir el diálogo
  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  // Función para cargar todos los datos
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchFriends(),
        fetchPendingRequests(),
        fetchSentRequests(),
      ]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener amigos
  const fetchFriends = async () => {
    try {
      const response = await api.getFriends();
      setFriends(response.data);
    } catch (error) {
      console.error("Error al cargar amigos:", error);
      showError("Error al cargar amigos.");
    }
  };

  // Función para obtener solicitudes pendientes
  const fetchPendingRequests = async () => {
    try {
      const response = await api.getPendingFriendRequests();
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error al cargar solicitudes pendientes:", error);
      showError("Error al cargar solicitudes pendientes.");
    }
  };

  // Función para obtener solicitudes enviadas
  const fetchSentRequests = async () => {
    try {
      const response = await api.getSentFriendRequests();
      setSentRequests(response.data);
    } catch (error) {
      console.error("Error al cargar solicitudes enviadas:", error);
      showError("Error al cargar solicitudes enviadas.");
    }
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({ ...prev, [name]: value }));
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

  // Enviar una solicitud de amistad
  const sendRequest = async () => {
    try {
      await requestSchema.validate(newRequest, { abortEarly: false });

      await api.sendFriendRequest(
        newRequest.recipientEmail,
        newRequest.description
      );
      showSuccess("Solicitud de amistad enviada correctamente.");
      setNewRequest({ recipientEmail: "", description: "" });
      fetchSentRequests();
    } catch (error) {
      if (error.name === "ValidationError") {
        error.inner.forEach((err) => {
          showError(err.message);
        });
      } else {
        console.error("Error al enviar solicitud:", error);
        showError(
          error.response?.data?.message ||
            "Error al enviar la solicitud de amistad."
        );
      }
    }
  };

  // Responder a una solicitud de amistad
  const respondToRequest = async (id, response) => {
    try {
      await api.respondToFriendRequest(id, response);
      showSuccess(
        `Solicitud de amistad ${
          response === "accept" ? "aceptada" : "rechazada"
        } correctamente.`
      );
      fetchData();
    } catch (error) {
      console.error("Error al responder a la solicitud:", error);
      showError("Error al responder a la solicitud de amistad.");
    }
  };

  // Eliminar un amigo
  const removeFriend = async (id) => {
    try {
      await api.removeFriend(id);
      showSuccess("Amigo eliminado correctamente.");
      fetchFriends();
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
      showError("Error al eliminar amigo.");
    }
  };

  return (
    <Dialog
      header="Gestión de Amigos"
      visible={visible}
      onHide={onHide}
      style={{ width: "80%" }}
      modal
    >
      <Toast ref={toast} />

      <TabView
        activeIndex={activeTab}
        onTabChange={(e) => setActiveTab(e.index)}
      >
        <TabPanel header="Enviar Solicitud">
          <div className="p-fluid">
            <div className="p-field">
              <label htmlFor="recipientEmail">Correo Electrónico</label>
              <InputText
                id="recipientEmail"
                name="recipientEmail"
                value={newRequest.recipientEmail}
                onChange={handleInputChange}
                placeholder="Ingresa el correo electrónico de tu amigo"
              />
            </div>
            <div className="p-field">
              <label htmlFor="description">Descripción (opcional)</label>
              <InputTextarea
                id="description"
                name="description"
                value={newRequest.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="Escribe un mensaje para tu solicitud de amistad"
              />
            </div>
            <Button
              label="Enviar Solicitud"
              icon="pi pi-send"
              onClick={sendRequest}
              className="p-mt-2"
            />
          </div>
        </TabPanel>

        <TabPanel header="Solicitudes Pendientes">
          {loading ? (
            <p>Cargando solicitudes pendientes...</p>
          ) : pendingRequests.length === 0 ? (
            <p>No tienes solicitudes de amistad pendientes.</p>
          ) : (
            <div className="friend-requests">
              {pendingRequests.map((request) => (
                <Card
                  key={request.id}
                  title={request.senderName}
                  subTitle={request.senderEmail}
                  className="friend-request-card"
                >
                  <p>
                    {request.description || "Sin mensaje de descripción."}
                  </p>
                  <div className="friend-request-actions">
                    <Button
                      label="Aceptar"
                      icon="pi pi-check"
                      className="p-button-success p-mr-2"
                      onClick={() => respondToRequest(request.id, "accept")}
                    />
                    <Button
                      label="Rechazar"
                      icon="pi pi-times"
                      className="p-button-danger"
                      onClick={() => respondToRequest(request.id, "reject")}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabPanel>

        <TabPanel header="Solicitudes Enviadas">
          {loading ? (
            <p>Cargando solicitudes enviadas...</p>
          ) : sentRequests.length === 0 ? (
            <p>No has enviado solicitudes de amistad.</p>
          ) : (
            <div className="friend-requests">
              {sentRequests.map((request) => (
                <Card
                  key={request.id}
                  title={request.recipientName}
                  subTitle={request.recipientEmail}
                  className="friend-request-card"
                >
                  <p>
                    {request.description || "Sin mensaje de descripción."}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {request.status === "PENDING"
                      ? "Pendiente"
                      : request.status === "ACCEPTED"
                      ? "Aceptada"
                      : "Rechazada"}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </TabPanel>

        <TabPanel header="Mis Amigos">
          {loading ? (
            <p>Cargando amigos...</p>
          ) : friends.length === 0 ? (
            <p>No tienes amigos agregados.</p>
          ) : (
            <div className="friends-list">
              {friends.map((friend) => (
                <Card
                  key={friend.id}
                  title={friend.name}
                  subTitle={friend.email}
                  className="friend-card"
                >
                  <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-text"
                    onClick={() => removeFriend(friend.id)}
                    tooltip="Eliminar amigo"
                  />
                </Card>
              ))}
            </div>
          )}
        </TabPanel>
      </TabView>
    </Dialog>
  );
};

export default FriendRequestMenu;