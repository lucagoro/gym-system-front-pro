import axios from 'axios';

const api = axios.create({
    // Usa la variable de entorno, y si no existe (local), usa localhost
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

// Interceptor para meter el token en cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        return response; // Si todo está ok, sigue su camino
    },
    (error) => {
        // Si el servidor responde con 401 o 403
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Sesión inválida o expirada. Redirigiendo al login...");
            
            localStorage.removeItem('token'); 
            // Podés limpiar otros estados de usuario aquí si tenés
            
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    });

export default api;