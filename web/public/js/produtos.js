document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar fornecedores para o select
    await loadFornecedores();
    
    // Carregar produtos
    await loadProdutos();
    
    // Configurar modal
    setupProdutoModal();
    
    // Configurar busca
    setupSearch();
});

async function loadFornecedores() {
    try {
        const response = await makeAuthenticatedRequest('/fornecedores');
        if (!response) return;
        
        const fornecedores = await response.json();
        const select = document.getElementById('produtoFornecedor');
        
        select.innerHTML = '<option value="">Selecione um fornecedor</option>';
        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id;
            option.textContent = fornecedor.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}

async function loadProdutos() {
    try {
        const response = await makeAuthenticatedRequest('/produtos');
        if (!response) return;
        
        const produtos = await response.json();
        const tbody = document.querySelector('#produtosTable tbody');
        
        tbody.innerHTML = '';
        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.descricao}</td>
                <td>${produto.codigoBarras}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.localEstoque}</td>
                <td>${produto.fornecedor ? produto.fornecedor.nome : 'N/A'}</td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-btn" data-id="${produto.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${produto.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editProduto(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteProduto(btn.dataset.id));
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function setupProdutoModal() {
    const modal = document.getElementById('produtoModal');
    const addBtn = document.getElementById('addProdutoBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('produtoForm');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Adicionar Novo Produto';
            document.getElementById('produtoId').value = '';
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
            
            const id = document.getElementById('produtoId').value;
            const produto = {
                nome: document.getElementById('produtoNome').value,
                descricao: document.getElementById('produtoDescricao').value,
                codigoBarras: document.getElementById('produtoCodigoBarras').value,
                quantidade: parseInt(document.getElementById('produtoQuantidade').value),
                localEstoque: document.getElementById('produtoLocal').value,
                fornecedorId: parseInt(document.getElementById('produtoFornecedor').value)
            };
            
            try {
                let response;
                if (id) {
                    // Editar produto existente
                    response = await makeAuthenticatedRequest(`/produtos/${id}`, 'PUT', produto);
                } else {
                    // Criar novo produto
                    response = await makeAuthenticatedRequest('/produtos', 'POST', produto);
                }
                
                if (response && response.ok) {
                    modal.style.display = 'none';
                    await loadProdutos();
                } else {
                    alert('Erro ao salvar produto');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao salvar produto');
            }
        });
    }
}

async function editProduto(id) {
    try {
        const response = await makeAuthenticatedRequest(`/produtos/${id}`);
        if (!response) return;
        
        if (response.ok) {
            const produto = await response.json();
            
            document.getElementById('modalTitle').textContent = 'Editar Produto';
            document.getElementById('produtoId').value = produto.id;
            document.getElementById('produtoNome').value = produto.nome;
            document.getElementById('produtoDescricao').value = produto.descricao;
            document.getElementById('produtoCodigoBarras').value = produto.codigoBarras;
            document.getElementById('produtoQuantidade').value = produto.quantidade;
            document.getElementById('produtoLocal').value = produto.localEstoque;
            document.getElementById('produtoFornecedor').value = produto.fornecedorId;
            
            document.getElementById('produtoModal').style.display = 'block';
        } else {
            alert('Erro ao carregar produto');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar produto');
    }
}

async function deleteProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
        const response = await makeAuthenticatedRequest(`/produtos/${id}`, 'DELETE');
        if (!response) return;
        
        if (response.ok) {
            await loadProdutos();
        } else {
            alert('Erro ao excluir produto');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir produto');
    }
}

function setupSearch() {
    const searchInput = document.getElementById('produtoSearch');
    const localFilter = document.getElementById('localFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', async () => {
            await loadProdutosWithFilters();
        });
    }
    
    if (localFilter) {
        localFilter.addEventListener('change', async () => {
            await loadProdutosWithFilters();
        });
    }
}

async function loadProdutosWithFilters() {
    try {
        const searchTerm = document.getElementById('produtoSearch').value.toLowerCase();
        const local = document.getElementById('localFilter').value;
        
        const response = await makeAuthenticatedRequest('/produtos');
        if (!response) return;
        
        const produtos = await response.json();
        const tbody = document.querySelector('#produtosTable tbody');
        
        tbody.innerHTML = '';
        produtos
            .filter(produto => {
                const matchesSearch = produto.nome.toLowerCase().includes(searchTerm) || 
                                    produto.descricao.toLowerCase().includes(searchTerm) ||
                                    produto.codigoBarras.toLowerCase().includes(searchTerm);
                const matchesLocal = local === '' || produto.localEstoque === local;
                return matchesSearch && matchesLocal;
            })
            .forEach(produto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>${produto.descricao}</td>
                    <td>${produto.codigoBarras}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.localEstoque}</td>
                    <td>${produto.fornecedor ? produto.fornecedor.nome : 'N/A'}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm edit-btn" data-id="${produto.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${produto.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editProduto(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteProduto(btn.dataset.id));
        });
    } catch (error) {
        console.error('Erro ao filtrar produtos:', error);
    }
}