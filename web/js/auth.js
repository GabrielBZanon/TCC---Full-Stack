// Função para fazer login mantendo SEU controller existente
async function fazerLogin(email, senha) {
    try {
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        // Adaptação para SEU controller
        if (!response.ok || data.erro) {
            throw new Error(data.erro || 'Erro ao fazer login');
        }

        // Armazena o token (ajuste conforme seu controller retorna)
        localStorage.setItem('token', data.token || data.accessToken);
        
        // Redireciona após login
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error('Erro no login:', error);
        // Mostra erro na tela
        const errorElement = document.getElementById('loginError');
        if (errorElement) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
        throw error;
    }
}

// Evento de submit do formulário
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    // Feedback visual
    const button = e.target.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="spinner"></div>';
    button.disabled = true;

    try {
        await fazerLogin(email, senha);
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
});