import api from '../api/axios';

export const login = async (username, password) => {
    try {
        // Enviamos las credenciales al endpoint que creamos en Spring
        const response = await api.post('/auth/login', { username, password });
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);   
            localStorage.setItem('username', response.data.username); 
            
            return response.data;
        }
    } catch (error) {
        console.error("Error en el login:", error.response?.data || error.message);
        throw error; // Para que el componente de Login pueda mostrar un cartel de error
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = '/login';
};