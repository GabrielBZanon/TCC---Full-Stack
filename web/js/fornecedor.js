// Configurações globais
const API_URL = 'http://localhost:3000/fornecedores';
const form = document.getElementById('fornecedorForm');
const cancelarBtn = document.getElementById('cancelarBtn');
const fornecedoresTable = document.getElementById('fornecedoresTable');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedores();
    document.getElementById('current-year').textContent = new Date().getFullYear();
    cancelarBtn.style.display = 'none';
});

// Event Listeners
form.addEventListener('submit', handleFormSubmit);
cancelarBtn.addEventListener('click', resetForm);

// Funções principais
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const fornecedorId = document.getElementById('fornecedorId').value;
    const fornecedorData = getFormData();
    
    try {
        const url = fornecedorId ? `${API_URL}/${fornecedorId}` : API_URL;
        const method = fornecedorId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fornecedorData)
        });
        
        if (!response.ok) throw new Error('Erro na requisição');
        
        resetForm();
        await carregarFornecedores();
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Operação falhou: ' + error.message, 'danger');
    }
}

async function carregarFornecedores() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar');
        
        const fornecedores = await response.json();
        renderizarFornecedores(fornecedores);
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Falha ao carregar fornecedores', 'danger');
    }
}

function renderizarFornecedores(fornecedores) {
    fornecedoresTable.innerHTML = fornecedores.map(fornecedor => `
        <tr>
            <td>${fornecedor.id}</td>
            <td>${fornecedor.nome}</td>
            <td>${fornecedor.email || '-'}</td>
            <td>${fornecedor.telefone || '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" 
                        onclick="editarFornecedor(${fornecedor.id})">Editar</button>
                <button class="btn btn-sm btn-danger" 
                        onclick="deletarFornecedor(${fornecedor.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Funções auxiliares
function getFormData() {
    return {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cnpj: document.getElementById('cnpj').value,
        endereco: document.getElementById('endereco').value
    };
}

function resetForm() {
    form.reset();
    document.getElementById('fornecedorId').value = '';
    cancelarBtn.style.display = 'none';
}

function preencherFormulario(fornecedor) {
    document.getElementById('fornecedorId').value = fornecedor.id;
    document.getElementById('nome').value = fornecedor.nome;
    document.getElementById('email').value = fornecedor.email || '';
    document.getElementById('telefone').value = fornecedor.telefone || '';
    document.getElementById('cnpj').value = fornecedor.cnpj || '';
    document.getElementById('endereco').value = fornecedor.endereco || '';
    cancelarBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fixed-top mx-auto mt-2`;
    alertDiv.style.maxWidth = '500px';
    alertDiv.style.zIndex = '1100';
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Funções globais (para chamada a partir do HTML)
window.editarFornecedor = async function(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar');
        
        const fornecedor = await response.json();
        preencherFormulario(fornecedor);
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Falha ao carregar fornecedor', 'danger');
    }
};

window.deletarFornecedor = async function(id) {
    if (!confirm('Confirmar exclusão deste fornecedor?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir');
        
        await carregarFornecedores();
        showAlert('Fornecedor excluído com sucesso', 'success');
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Falha ao excluir fornecedor', 'danger');
    }
};