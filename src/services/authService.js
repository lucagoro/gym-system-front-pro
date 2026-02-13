import api from '../api/axios';

export const login = async (username, password) => {
    // Enviamos las credenciales al endpoint que creamos en Spring
    const response = await api.post('/auth/login', { username, password });
    
    // Si la respuesta trae el token, lo guardamos
    if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);   
        localStorage.setItem('username', response.data.username); 
        window.location.href = '/dashboard';
    }
    
    return response.data;
};

export const logout = () => {
    sessionStorage.removeItem('token'); 
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    window.location.href = '/login';
};