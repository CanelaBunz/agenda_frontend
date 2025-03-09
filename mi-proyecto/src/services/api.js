import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // URL de tu backend
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
        return apiClient.post('/register', userData);
    },
    login(credentials) {
        return apiClient.post('/login', credentials);
    },
    logout() {
        return apiClient.post('/logout');
    },
    getEvents() {
        return apiClient.get('/events');
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