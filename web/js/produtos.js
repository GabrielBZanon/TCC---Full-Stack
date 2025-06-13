document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticação
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos do modal
    const modal = document.getElementById('modalProduto');
    const btnNovo = document.getElementById('btnNovoProduto');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('formProduto');

    // Abre modal para novo produto
    btnNovo.onclick = () => {
        document.getElementById('modalTitulo').textContent = 'Novo Produto';
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

    // Carrega produtos
    carregarProdutos();

    // Manipula envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const produto = {
            nome: document.getElementById('produtoNome').value,
            // Adicione outros campos conforme seu modelo
        };

        const produtoId = document.getElementById('produtoId').value;
        const url = produtoId ? `/api/produtos/${produtoId}` : '/api/produtos';
        const method = produtoId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(produto)
            });

            if (!response.ok) throw new Error('Erro ao salvar produto');

            modal.style.display = 'none';
            carregarProdutos();
        } catch (error) {
            alert(error.message);
        }
    });
});

async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const produtos = await response.json();
        
        const tbody = document.querySelector('#tabelaProdutos tbody');
        tbody.innerHTML = produtos.map(produto => `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>
                    <button onclick="editarProduto(${produto.id})">Editar</button>
                    <button onclick="excluirProduto(${produto.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Funções globais para ações
window.editarProduto = async (id) => {
    try {
        const response = await fetch(`/api/produtos/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const produto = await response.json();
        
        document.getElementById('modalTitulo').textContent = 'Editar Produto';
        document.getElementById('produtoId').value = produto.id;
        document.getElementById('produtoNome').value = produto.nome;
        // Preencha outros campos
        
        document.getElementById('modalProduto').style.display = 'block';
    } catch (error) {
        alert('Erro ao carregar produto');
    }
};

window.excluirProduto = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
        const response = await fetch(`/api/produtos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao excluir produto');
        
        carregarProdutos();
    } catch (error) {
        alert(error.message);
    }
};