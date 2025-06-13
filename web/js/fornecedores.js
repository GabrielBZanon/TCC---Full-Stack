document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticação
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos do modal
    const modal = document.getElementById('modalFornecedor');
    const btnNovo = document.getElementById('btnNovoFornecedor');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('formFornecedor');

    // Abre modal para novo fornecedor
    btnNovo.onclick = () => {
        document.getElementById('modalTitulo').textContent = 'Novo Fornecedor';
        form.reset();
        modal.style.display = 'block';
    };

    // Fecha modal
    span.onclick = () => {
        modal.style.display = 'none';
    };

    // Fecha modal ao clicar fora
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Carrega fornecedores
    carregarFornecedores();

    // Manipula envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fornecedor = {
            nome: document.getElementById('fornecedorNome').value,
            cnpj: document.getElementById('fornecedorCNPJ').value,
            contato: document.getElementById('fornecedorContato').value,
            email: document.getElementById('fornecedorEmail').value
        };

        const fornecedorId = document.getElementById('fornecedorId').value;
        const url = fornecedorId ? `/api/fornecedores/${fornecedorId}` : '/api/fornecedores';
        const method = fornecedorId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(fornecedor)
            });

            if (!response.ok) throw new Error('Erro ao salvar fornecedor');

            modal.style.display = 'none';
            carregarFornecedores();
        } catch (error) {
            alert(error.message);
        }
    });
});

async function carregarFornecedores() {
    try {
        const response = await fetch('/api/fornecedores', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const fornecedores = await response.json();
        
        const tbody = document.querySelector('#tabelaFornecedores tbody');
        tbody.innerHTML = fornecedores.map(fornecedor => `
            <tr>
                <td>${fornecedor.id}</td>
                <td>${fornecedor.nome}</td>
                <td>${fornecedor.cnpj}</td>
                <td>${fornecedor.contato}</td>
                <td>
                    <button onclick="editarFornecedor(${fornecedor.id})">Editar</button>
                    <button onclick="excluirFornecedor(${fornecedor.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}

// Funções globais para ações
window.editarFornecedor = async (id) => {
    try {
        const response = await fetch(`/api/fornecedores/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const fornecedor = await response.json();
        
        document.getElementById('modalTitulo').textContent = 'Editar Fornecedor';
        document.getElementById('fornecedorId').value = fornecedor.id;
        document.getElementById('fornecedorNome').value = fornecedor.nome;
        document.getElementById('fornecedorCNPJ').value = fornecedor.cnpj;
        document.getElementById('fornecedorContato').value = fornecedor.contato;
        document.getElementById('fornecedorEmail').value = fornecedor.email;
        
        document.getElementById('modalFornecedor').style.display = 'block';
    } catch (error) {
        alert('Erro ao carregar fornecedor');
    }
};

window.excluirFornecedor = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return;
    
    try {
        const response = await fetch(`/api/fornecedores/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao excluir fornecedor');
        
        carregarFornecedores();
    } catch (error) {
        alert(error.message);
    }
};