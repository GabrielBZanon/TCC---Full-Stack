// Função para mostrar/ocultar erros
function showError(message = '') {
    const errorElement = document.getElementById('loginError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
}

// Função para habilitar/desabilitar o botão
function setButtonState(loading) {
    const button = document.querySelector('#loginForm button[type="submit"]');
    if (button) {
        button.disabled = loading;
        button.innerHTML = loading 
            ? '<span class="spinner"></span> Processando...' 
            : 'Entrar';
    }
}

// Validação de email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Função principal de login
async function fazerLogin(email, senha) {
    try {
        setButtonState(true);
        
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        // Tratamento específico para diferentes status codes
        if (response.status === 401) {
            throw new Error('Credenciais inválidas');
        } else if (response.status === 404) {
            throw new Error('Endpoint não encontrado - verifique a URL da API');
        } else if (response.status === 500) {
            throw new Error('Erro interno no servidor');
        } else if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Verificação mais robusta do token
        if (!data?.token) {
            throw new Error('Resposta inválida do servidor: token não encontrado');
        }

        // Armazena o token e redireciona
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user || {}));
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error('Erro no login:', error);
        
        // Mensagens mais amigáveis para o usuário
        let userMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
            userMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else if (error.message.includes('Credenciais inválidas')) {
            userMessage = 'E-mail ou senha incorretos';
        }
        
        showError(userMessage);
        throw error;
    } finally {
        setButtonState(false);
    }
}

// Configuração do evento de submit
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Formulário de login não encontrado');
        return;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        showError('');

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;

        // Validações melhoradas
        if (!email || !senha) {
            showError('Por favor, preencha todos os campos');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Por favor, insira um e-mail válido');
            return;
        }

        if (senha.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            await fazerLogin(email, senha);
        } catch (error) {
            // Erro já foi tratado em fazerLogin()
        }
    });
});