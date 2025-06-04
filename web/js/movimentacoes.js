// Configurações da API
const API_URL = 'http://localhost:3000/movimentacoes';
const PRODUTOS_URL = 'http://localhost:3000/produtos';

// Elementos do DOM
const form = document.getElementById('movimentacaoForm');
const cancelarBtn = document.getElementById('cancelarBtn');
const movimentacoesTable = document.getElementById('movimentacoesTable');
const produtoSelect = document.getElementById('produtoId');

// Variáveis globais
let produtos = [];

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Configurar data atual como padrão
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
    document.getElementById('data').value = localISOTime;
    
    await carregarProdutos();
    await carregarMovimentacoes();
});

// Carregar produtos para o select
async function carregarProdutos() {
    try {
        const response = await fetch(PRODUTOS_URL);
        produtos = await response.json();
        
        produtoSelect.innerHTML = '<option value="">Selecione um produto...</option>';
        produtos.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.id;
            option.textContent = `${produto.nome} (${produto.codigoBarras})`;
            produtoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtoSelect.innerHTML = '<option value="">Erro ao carregar produtos</option>';
    }
}

// Carregar movimentações
async function carregarMovimentacoes() {
    try {
        const response = await fetch(API_URL);
        const movimentacoes = await response.json();
        
        movimentacoesTable.innerHTML = movimentacoes.map(mov => {
            const produto = produtos.find(p => p.id === mov.produtoId) || {};
            const data = new Date(mov.data).toLocaleString('pt-BR');
            
            return `
                <tr>
                    <td>${mov.id}</td>
                    <td>${data}</td>
                    <td>${produto.nome || 'Produto não encontrado'}</td>
                    <td class="${mov.tipo === 'ENTRADA' ? 'tipo-entrada' : 'tipo-saida'}">
                        ${mov.tipo}
                    </td>
                    <td>${mov.quantidade}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-2" 
                                onclick="editarMovimentacao(${mov.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" 
                                onclick="deletarMovimentacao(${mov.id})">Excluir</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar movimentações:', error);
        movimentacoesTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    Erro ao carregar movimentações
                </td>
            </tr>
        `;
    }
}

// Manipular envio do formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const movimentacaoId = document.getElementById('movimentacaoId').value;
    const movimentacaoData = {
        tipo: document.getElementById('tipo').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        produtoId: parseInt(document.getElementById('produtoId').value),
        data: document.getElementById('data').value
    };
    
    try {
        const url = movimentacaoId ? `${API_URL}/${movimentacaoId}` : API_URL;
        const method = movimentacaoId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movimentacaoData)
        });
        
        if (!response.ok) throw new Error('Erro na requisição');
        
        resetForm();
        await carregarMovimentacoes();
        
        // Atualizar estoque do produto (opcional)
        await atualizarEstoqueProduto(
            movimentacaoData.produtoId, 
            movimentacaoData.tipo, 
            movimentacaoData.quantidade
        );
        
        alert('Movimentação registrada com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao registrar movimentação: ' + error.message);
    }
});

// Atualizar estoque do produto (opcional)
async function atualizarEstoqueProduto(produtoId, tipo, quantidade) {
    try {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) return;
        
        const novaQuantidade = tipo === 'ENTRADA' 
            ? produto.quantidade + quantidade 
            : produto.quantidade - quantidade;
        
        await fetch(`${PRODUTOS_URL}/${produtoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantidade: novaQuantidade
            })
        });
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
    }
}

// Editar movimentação
window.editarMovimentacao = async function(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const movimentacao = await response.json();
        
        // Formatar data para o input datetime-local
        const data = new Date(movimentacao.data);
        const timezoneOffset = data.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(data - timezoneOffset)).toISOString().slice(0, 16);
        
        document.getElementById('movimentacaoId').value = movimentacao.id;
        document.getElementById('tipo').value = movimentacao.tipo;
        document.getElementById('quantidade').value = movimentacao.quantidade;
        document.getElementById('produtoId').value = movimentacao.produtoId;
        document.getElementById('data').value = localISOTime;
        
        cancelarBtn.style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao carregar movimentação:', error);
        alert('Falha ao carregar movimentação para edição');
    }
};

// Deletar movimentação
window.deletarMovimentacao = async function(id) {
    if (!confirm('Tem certeza que deseja excluir esta movimentação?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erro ao excluir');
        
        await carregarMovimentacoes();
        alert('Movimentação excluída com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao excluir movimentação: ' + error.message);
    }
};

// Resetar formulário
function resetForm() {
    form.reset();
    document.getElementById('movimentacaoId').value = '';
    cancelarBtn.style.display = 'none';
    
    // Restaurar data atual
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
    document.getElementById('data').value = localISOTime;
}

// Cancelar edição
cancelarBtn.addEventListener('click', resetForm);