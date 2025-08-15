export class ProdutosModule {
    static async render() {
        const content = document.getElementById('app-content');
        content.innerHTML = `
            <h2>Produtos</h2>
            <button id="novo-produto" class="btn btn-primary">Novo Produto</button>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Código</th>
                        <th>Estoque</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="produtos-table-body">
                    <!-- Dados serão carregados aqui -->
                </tbody>
            </table>
        `;

        // Carrega os produtos
        await this.loadProdutos();

        // Event listeners
        document.getElementById('novo-produto').addEventListener('click', () => this.renderForm());
    }

    static async loadProdutos() {
        try {
            const produtos = await api.getProdutos();
            const tableBody = document.getElementById('produtos-table-body');
            
            tableBody.innerHTML = produtos.map(produto => `
                <tr>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.codigoBarras}</td>
                    <td>${produto.quantidade}</td>
                    <td>
                        <button class="btn btn-sm" data-action="edit" data-id="${produto.id}">Editar</button>
                        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${produto.id}">Excluir</button>
                    </td>
                </tr>
            `).join('');

            // Adiciona event listeners aos botões
            document.querySelectorAll('[data-action="edit"]').forEach(btn => {
                btn.addEventListener('click', (e) => this.renderForm(e.target.dataset.id));
            });

            document.querySelectorAll('[data-action="delete"]').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteProduto(e.target.dataset.id));
            });

        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            alert('Erro ao carregar produtos');
        }
    }

    static async renderForm(id = null) {
        let produto = { 
            nome: '', 
            descricao: '', 
            codigoBarras: '', 
            quantidade: 0, 
            localEstoque: '', 
            fornecedorId: null 
        };

        let fornecedores = [];
        
        try {
            fornecedores = await api.getFornecedores();
            
            if (id) {
                produto = await api.getProduto(id);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do formulário:', error);
            alert('Erro ao carregar formulário');
            return;
        }

        const content = document.getElementById('app-content');
        content.innerHTML = `
            <h2>${id ? 'Editar' : 'Novo'} Produto</h2>
            <form id="produto-form">
                <input type="hidden" id="produto-id" value="${id || ''}">
                
                <div class="form-group">
                    <label for="produto-nome">Nome</label>
                    <input type="text" id="produto-nome" value="${produto.nome}" required>
                </div>
                
                <div class="form-group">
                    <label for="produto-descricao">Descrição</label>
                    <textarea id="produto-descricao" rows="3">${produto.descricao}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="produto-codigo">Código de Barras</label>
                    <input type="text" id="produto-codigo" value="${produto.codigoBarras}" required>
                </div>
                
                <div class="form-group">
                    <label for="produto-quantidade">Quantidade em Estoque</label>
                    <input type="number" id="produto-quantidade" value="${produto.quantidade}" required>
                </div>
                
                <div class="form-group">
                    <label for="produto-local">Local de Estoque</label>
                    <input type="text" id="produto-local" value="${produto.localEstoque}" required>
                </div>
                
                <div class="form-group">
                    <label for="produto-fornecedor">Fornecedor</label>
                    <select id="produto-fornecedor" required>
                        <option value="">Selecione um fornecedor</option>
                        ${fornecedores.map(f => `
                            <option value="${f.id}" ${f.id === produto.fornecedorId ? 'selected' : ''}>
                                ${f.nome} (${f.cnpj})
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <button type="submit" class="btn btn-primary">Salvar</button>
                <button type="button" id="cancelar-produto" class="btn">Cancelar</button>
            </form>
        `;

        document.getElementById('produto-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduto();
        });

        document.getElementById('cancelar-produto').addEventListener('click', () => this.render());
    }

    static async saveProduto() {
        const id = document.getElementById('produto-id').value || null;
        const produto = {
            nome: document.getElementById('produto-nome').value,
            descricao: document.getElementById('produto-descricao').value,
            codigoBarras: document.getElementById('produto-codigo').value,
            quantidade: parseInt(document.getElementById('produto-quantidade').value),
            localEstoque: document.getElementById('produto-local').value,
            fornecedorId: parseInt(document.getElementById('produto-fornecedor').value)
        };

        try {
            if (id) {
                await api.updateProduto(id, produto);
            } else {
                await api.createProduto(produto);
            }
            this.render();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto');
        }
    }

    static async deleteProduto(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await api.deleteProduto(id);
                this.render();
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                alert('Erro ao excluir produto');
            }
        }
    }
}