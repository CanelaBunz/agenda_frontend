import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8081/api', // URL de tu backend Spring Boot
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las solicitudes
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Agrega el token al header
    }
    return config;
});

export default {
    register(userData) {
        return apiClient.post('/auth/register', userData);
    },
    login(credentials) {
        return apiClient.post('/auth/login', credentials);
    },
    logout() {
        return apiClient.post('/auth/logout');
    },
    getEvents(start, end) {
        // Si no se proporcionan fechas, usar un rango predeterminado (un mes)
        if (!start || !end) {
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        // Formatear fechas a ISO para la API
        const startISO = start instanceof Date ? start.toISOString() : start;
        const endISO = end instanceof Date ? end.toISOString() : end;

        return apiClient.get('/events', {
            params: {
                start: startISO,
                end: endISO
            }
        });
    },
    createEvent(event) {
        return apiClient.post('/events', event);
    },
    updateEvent(id, event) {
        return apiClient.put(`/events/${id}`, event);
    },
    deleteEvent(id) {
        return apiClient.delete(`/events/${id}`);
    },
    getItineraries(start, end) {
        // Si no se proporcionan fechas, usar un rango predeterminado (un mes)
        if (!start || !end) {
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        // Formatear fechas a ISO para la API
        const startISO = start instanceof Date ? start.toISOString() : start;
        const endISO = end instanceof Date ? end.toISOString() : end;

        return apiClient.get('/itineraries', {
            params: {
                start: startISO,
                end: endISO
            }
        });
    },
    createItinerary(itinerary) {
        return apiClient.post('/itineraries', itinerary);
    },
    updateItinerary(id, itinerary) {
        return apiClient.put(`/itineraries/${id}`, itinerary);
    },
    deleteItinerary(id) {
        return apiClient.delete(`/itineraries/${id}`);
    },
    getContacts() {
        return apiClient.get('/contacts');
    },
    createContact(contact) {
        return apiClient.post('/contacts', contact);
    },
    updateContact(id, contact) {
        return apiClient.put(`/contacts/${id}`, contact);
    },
    deleteContact(id) {
        return apiClient.delete(`/contacts/${id}`);
    },
    // Métodos para gestionar amigos
    getFriends() {
        return apiClient.get('/friends');
    },
    getPendingFriendRequests() {
        return apiClient.get('/friends/requests/pending');
    },
    getSentFriendRequests() {
        return apiClient.get('/friends/requests/sent');
    },
    sendFriendRequest(recipientEmail, description) {
        return apiClient.post('/friends/request', null, {
            params: {
                recipientEmail,
                description
            }
        });
    },
    respondToFriendRequest(id, response) {
        return apiClient.put(`/friends/response/${id}`, null, {
            params: {
                response
            }
        });
    },
    removeFriend(id) {
        return apiClient.delete(`/friends/${id}`);
    },
    updateFriend(id, friendData) {
        return apiClient.put(`/friends/${id}`, friendData);
    },

    // Métodos para gestionar solicitudes de eventos
    getSentEventRequests() {
        return apiClient.get('/event-requests/sent');
    },
    getReceivedEventRequests() {
        return apiClient.get('/event-requests/received');
    },
    getPendingEventRequests() {
        return apiClient.get('/event-requests/pending');
    },
    sendEventRequest(eventId, recipientId) {
        return apiClient.post('/event-requests/send', null, {
            params: {
                eventId,
                recipientId
            }
        });
    },

    // Método para obtener eventos de un amigo específico
    getFriendEvents(friendId, start, end) {
        // Si no se proporcionan fechas, usar un rango predeterminado (un mes)
        if (!start || !end) {
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        // Formatear fechas a ISO para la API
        const startISO = start instanceof Date ? start.toISOString() : start;
        const endISO = end instanceof Date ? end.toISOString() : end;

        return apiClient.get(`/events/friend/${friendId}`, {
            params: {
                start: startISO,
                end: endISO
            }
        });
    },
    respondToEventRequest(requestId, response) {
        return apiClient.put(`/event-requests/respond/${requestId}`, null, {
            params: {
                response
            }
        });
    },
};
