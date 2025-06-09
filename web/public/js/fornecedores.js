document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar fornecedores
    await loadFornecedores();
    
    // Configurar modal
    setupFornecedorModal();
    
    // Configurar busca
    setupSearch();
});

async function loadFornecedores() {
    try {
        const response = await makeAuthenticatedRequest('/fornecedores');
        if (!response) return;
        
        const fornecedores = await response.json();
        const tbody = document.querySelector('#fornecedoresTable tbody');
        
        tbody.innerHTML = '';
        fornecedores.forEach(fornecedor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${fornecedor.nome}</td>
                <td>${fornecedor.cnpj}</td>
                <td>${fornecedor.contato}</td>
                <td>${fornecedor.email}</td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-btn" data-id="${fornecedor.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${fornecedor.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editFornecedor(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteFornecedor(btn.dataset.id));
        });
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}

function setupFornecedorModal() {
    const modal = document.getElementById('fornecedorModal');
    const addBtn = document.getElementById('addFornecedorBtn');
    const closeBtn = document.querySelector('.fornecedor-modal .close');
    const form = document.getElementById('fornecedorForm');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Adicionar Novo Fornecedor';
            document.getElementById('fornecedorId').value = '';
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
            
            const id = document.getElementById('fornecedorId').value;
            const fornecedor = {
                nome: document.getElementById('fornecedorNome').value,
                cnpj: document.getElementById('fornecedorCnpj').value,
                contato: document.getElementById('fornecedorContato').value,
                email: document.getElementById('fornecedorEmail').value
            };
            
            try {
                let response;
                if (id) {
                    // Editar fornecedor existente
                    response = await makeAuthenticatedRequest(`/fornecedores/${id}`, 'PUT', fornecedor);
                } else {
                    // Criar novo fornecedor
                    response = await makeAuthenticatedRequest('/fornecedores', 'POST', fornecedor);
                }
                
                if (response && response.ok) {
                    modal.style.display = 'none';
                    await loadFornecedores();
                } else {
                    alert('Erro ao salvar fornecedor');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao salvar fornecedor');
            }
        });
    }
}

async function editFornecedor(id) {
    try {
        const response = await makeAuthenticatedRequest(`/fornecedores/${id}`);
        if (!response) return;
        
        if (response.ok) {
            const fornecedor = await response.json();
            
            document.getElementById('modalTitle').textContent = 'Editar Fornecedor';
            document.getElementById('fornecedorId').value = fornecedor.id;
            document.getElementById('fornecedorNome').value = fornecedor.nome;
            document.getElementById('fornecedorCnpj').value = fornecedor.cnpj;
            document.getElementById('fornecedorContato').value = fornecedor.contato;
            document.getElementById('fornecedorEmail').value = fornecedor.email;
            
            document.getElementById('fornecedorModal').style.display = 'block';
        } else {
            alert('Erro ao carregar fornecedor');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar fornecedor');
    }
}

async function deleteFornecedor(id) {
    if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return;
    
    try {
        const response = await makeAuthenticatedRequest(`/fornecedores/${id}`, 'DELETE');
        if (!response) return;
        
        if (response.ok) {
            await loadFornecedores();
        } else {
            alert('Erro ao excluir fornecedor');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir fornecedor');
    }
}

function setupSearch() {
    const searchInput = document.getElementById('fornecedorSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', async () => {
            await loadFornecedoresWithFilters();
        });
    }
}

async function loadFornecedoresWithFilters() {
    try {
        const searchTerm = document.getElementById('fornecedorSearch').value.toLowerCase();
        
        const response = await makeAuthenticatedRequest('/fornecedores');
        if (!response) return;
        
        const fornecedores = await response.json();
        const tbody = document.querySelector('#fornecedoresTable tbody');
        
        tbody.innerHTML = '';
        fornecedores
            .filter(fornecedor => {
                return fornecedor.nome.toLowerCase().includes(searchTerm) || 
                       fornecedor.cnpj.includes(searchTerm) ||
                       fornecedor.email.toLowerCase().includes(searchTerm);
            })
            .forEach(fornecedor => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${fornecedor.nome}</td>
                    <td>${fornecedor.cnpj}</td>
                    <td>${fornecedor.contato}</td>
                    <td>${fornecedor.email}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm edit-btn" data-id="${fornecedor.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${fornecedor.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editFornecedor(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteFornecedor(btn.dataset.id));
        });
    } catch (error) {
        console.error('Erro ao filtrar fornecedores:', error);
    }
}