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
};
