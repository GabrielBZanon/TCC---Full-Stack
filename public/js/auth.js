import { api } from './api.js';

export const auth = {
    isAuthenticated() {
        return localStorage.getItem('token') !== null;
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    },

    async handleLogin(email, password) {
        try {
            const response = await api.login(email, password);
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                window.location.href = '/';
            } else {
                throw new Error(response.error || 'Erro no login');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }
};

// Página de login separada (login.html)
if (window.location.pathname.includes('/login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('login-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                try {
                    await auth.handleLogin(email, password);
                } catch (error) {
                    alert('Login falhou: ' + error.message);
                }
            });
        }
    });
}