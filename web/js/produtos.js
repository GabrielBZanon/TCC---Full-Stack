// Configurações da API
const API_URL = 'http://localhost:3000/produtos';
const FORNECEDORES_URL = 'http://localhost:3000/fornecedores';

// Elementos do DOM
const form = document.getElementById('produtoForm');
const cancelarBtn = document.getElementById('cancelarBtn');
const produtosTable = document.getElementById('produtosTable');
const fornecedorSelect = document.getElementById('fornecedorId');

// Variáveis globais
let fornecedores = [];

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    await carregarFornecedores();
    await carregarProdutos();
});

// Carregar fornecedores para o select
async function carregarFornecedores() {
    try {
        const response = await fetch(FORNECEDORES_URL);
        fornecedores = await response.json();
        
        fornecedorSelect.innerHTML = '<option value="">Selecione um fornecedor...</option>';
        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id;
            option.textContent = `${fornecedor.nome} (${fornecedor.cnpj})`;
            fornecedorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
        fornecedorSelect.innerHTML = '<option value="">Erro ao carregar fornecedores</option>';
    }
}

// Carregar produtos
async function carregarProdutos() {
    try {
        const response = await fetch(API_URL);
        const produtos = await response.json();
        
        produtosTable.innerHTML = produtos.map(produto => {
            const fornecedor = fornecedores.find(f => f.id === produto.fornecedorId) || {};
            const estoqueClass = produto.quantidade < 10 ? 'estoque-baixo' : 'estoque-normal';
            
            return `
                <tr>
                    <td>${produto.codigoBarras}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.descricao}</td>
                    <td class="${estoqueClass}">${produto.quantidade}</td>
                    <td>${produto.localEstoque}</td>
                    <td>${fornecedor.nome || 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-2" 
                                onclick="editarProduto(${produto.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" 
                                onclick="deletarProduto(${produto.id})">Excluir</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtosTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Erro ao carregar produtos
                </td>
            </tr>
        `;
    }
}

// Manipular envio do formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const produtoId = document.getElementById('produtoId').value;
    const produtoData = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        codigoBarras: document.getElementById('codigoBarras').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        localEstoque: document.getElementById('localEstoque').value,
        fornecedorId: parseInt(document.getElementById('fornecedorId').value)
    };
    
    try {
        const url = produtoId ? `${API_URL}/${produtoId}` : API_URL;
        const method = produtoId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoData)
        });
        
        if (!response.ok) throw new Error('Erro na requisição');
        
        resetForm();
        await carregarProdutos();
        alert('Produto salvo com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao salvar produto: ' + error.message);
    }
});

// Editar produto
window.editarProduto = async function(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const produto = await response.json();
        
        document.getElementById('produtoId').value = produto.id;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('descricao').value = produto.descricao;
        document.getElementById('codigoBarras').value = produto.codigoBarras;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('localEstoque').value = produto.localEstoque;
        document.getElementById('fornecedorId').value = produto.fornecedorId;
        
        cancelarBtn.style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        alert('Falha ao carregar produto para edição');
    }
};

// Deletar produto
window.deletarProduto = async function(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erro ao excluir');
        
        await carregarProdutos();
        alert('Produto excluído com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao excluir produto: ' + error.message);
    }
};

// Resetar formulário
function resetForm() {
    form.reset();
    document.getElementById('produtoId').value = '';
    cancelarBtn.style.display = 'none';
}

// Cancelar edição
cancelarBtn.addEventListener('click', resetForm);