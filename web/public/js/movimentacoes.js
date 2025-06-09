document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar produtos para o select
    await loadProdutosForSelect();
    
    // Carregar movimentações
    await loadMovimentacoes();
    
    // Configurar modal
    setupMovimentacaoModal();
    
    // Configurar filtros
    setupFilters();
});

async function loadProdutosForSelect() {
    try {
        const response = await makeAuthenticatedRequest('/produtos');
        if (!response) return;
        
        const produtos = await response.json();
        const select = document.getElementById('movimentacaoProduto');
        
        select.innerHTML = '<option value="">Selecione um produto</option>';
        produtos.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.id;
            option.textContent = `${produto.nome} (${produto.codigoBarras})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function loadMovimentacoes() {
    try {
        const response = await makeAuthenticatedRequest('/movimentacoes');
        if (!response) return;
        
        const movimentacoes = await response.json();
        const tbody = document.querySelector('#movimentacoesTable tbody');
        
        tbody.innerHTML = '';
        movimentacoes.forEach(mov => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <span class="movimentacao-badge ${mov.tipo.toLowerCase()}">
                        ${mov.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                    </span>
                </td>
                <td>${mov.produto.nome}</td>
                <td>${mov.quantidade}</td>
                <td>${new Date(mov.data).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${mov.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteMovimentacao(btn.dataset.id));
        });
    } catch (error) {
        console.error('Erro ao carregar movimentações:', error);
    }
}

function setupMovimentacaoModal() {
    const modal = document.getElementById('movimentacaoModal');
    const addBtn = document.getElementById('addMovimentacaoBtn');
    const closeBtn = document.querySelector('.movimentacao-modal .close');
    const form = document.getElementById('movimentacaoForm');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Registrar Movimentação';
            document.getElementById('movimentacaoId').value = '';
            form.reset();
            modal.style.display = 'block';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const movimentacao = {
                tipo: document.getElementById('movimentacaoTipo').value,
                quantidade: parseInt(document.getElementById('movimentacaoQuantidade').value),
                produtoId: parseInt(document.getElementById('movimentacaoProduto').value)
            };
            
            try {
                const response = await makeAuthenticatedRequest('/movimentacoes', 'POST', movimentacao);
                
                if (response && response.ok) {
                    modal.style.display = 'none';
                    await loadMovimentacoes();
                } else {
                    alert('Erro ao registrar movimentação');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao registrar movimentação');
            }
        });
    }
}

async function deleteMovimentacao(id) {
    if (!confirm('Tem certeza que deseja excluir esta movimentação?')) return;
    
    try {
        const response = await makeAuthenticatedRequest(`/movimentacoes/${id}`, 'DELETE');
        if (!response) return;
        
        if (response.ok) {
            await loadMovimentacoes();
        } else {
            alert('Erro ao excluir movimentação');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir movimentação');
    }
}

function setupFilters() {
    const tipoFilter = document.getElementById('tipoFilter');
    const produtoFilter = document.getElementById('produtoFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (tipoFilter) {
        tipoFilter.addEventListener('change', async () => {
            await loadMovimentacoesWithFilters();
        });
    }
    
    if (produtoFilter) {
        produtoFilter.addEventListener('change', async () => {
            await loadMovimentacoesWithFilters();
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', async () => {
            await loadMovimentacoesWithFilters();
        });
    }
}

async function loadMovimentacoesWithFilters() {
    try {
        const tipo = document.getElementById('tipoFilter').value;
        const produtoId = document.getElementById('produtoFilter').value;
        const date = document.getElementById('dateFilter').value;
        
        const response = await makeAuthenticatedRequest('/movimentacoes');
        if (!response) return;
        
        const movimentacoes = await response.json();
        const tbody = document.querySelector('#movimentacoesTable tbody');
        
        tbody.innerHTML = '';
        movimentacoes
            .filter(mov => {
                const matchesTipo = tipo === '' || mov.tipo === tipo;
                const matchesProduto = produtoId === '' || mov.produtoId === parseInt(produtoId);
                const matchesDate = date === '' || 
                    new Date(mov.data).toISOString().split('T')[0] === date;
                
                return matchesTipo && matchesProduto && matchesDate;
            })
            .forEach(mov => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <span class="movimentacao-badge ${mov.tipo.toLowerCase()}">
                            ${mov.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                        </span>
                    </td>
                    <td>${mov.produto.nome}</td>
                    <td>${mov.quantidade}</td>
                    <td>${new Date(mov.data).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${mov.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteMovimentacao(btn.dataset.id));
        });
    } catch (error) {
        console.error('Erro ao filtrar movimentações:', error);
    }
}