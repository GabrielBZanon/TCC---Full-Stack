export class FornecedoresModule {
    static async render() {
        const content = document.getElementById('app-content');
        content.innerHTML = `
            <h2>Fornecedores</h2>
            <button id="novo-fornecedor" class="btn btn-primary">Novo Fornecedor</button>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CNPJ</th>
                        <th>Contato</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="fornecedores-table-body">
                    <!-- Dados serão carregados aqui -->
                </tbody>
            </table>
        `;

        await this.loadFornecedores();

        document.getElementById('novo-fornecedor').addEventListener('click', () => this.renderForm());
    }

    static async loadFornecedores() {
        try {
            const fornecedores = await api.getFornecedores();
            const tableBody = document.getElementById('fornecedores-table-body');
            
            tableBody.innerHTML = fornecedores.map(fornecedor => `
                <tr>
                    <td>${fornecedor.id}</td>
                    <td>${fornecedor.nome}</td>
                    <td>${fornecedor.cnpj}</td>
                    <td>${fornecedor.contato}</td>
                    <td>
                        <button class="btn btn-sm" data-action="edit" data-id="${fornecedor.id}">Editar</button>
                        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${fornecedor.id}">Excluir</button>
                    </td>
                </tr>
            `).join('');

            document.querySelectorAll('[data-action="edit"]').forEach(btn => {
                btn.addEventListener('click', (e) => this.renderForm(e.target.dataset.id));
            });

            document.querySelectorAll('[data-action="delete"]').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteFornecedor(e.target.dataset.id));
            });

        } catch (error) {
            console.error('Erro ao carregar fornecedores:', error);
            alert('Erro ao carregar fornecedores');
        }
    }

    static async renderForm(id = null) {
        let fornecedor = { nome: '', cnpj: '', contato: '', email: '' };
        
        if (id) {
            try {
                fornecedor = await api.getFornecedor(id);
            } catch (error) {
                console.error('Erro ao carregar fornecedor:', error);
                alert('Erro ao carregar fornecedor');
                return;
            }
        }

        const content = document.getElementById('app-content');
        content.innerHTML = `
            <h2>${id ? 'Editar' : 'Novo'} Fornecedor</h2>
            <form id="fornecedor-form">
                <input type="hidden" id="fornecedor-id" value="${id || ''}">
                
                <div class="form-group">
                    <label for="fornecedor-nome">Nome</label>
                    <input type="text" id="fornecedor-nome" value="${fornecedor.nome}" required>
                </div>
                
                <div class="form-group">
                    <label for="fornecedor-cnpj">CNPJ</label>
                    <input type="text" id="fornecedor-cnpj" value="${fornecedor.cnpj}" required>
                </div>
                
                <div class="form-group">
                    <label for="fornecedor-contato">Contato</label>
                    <input type="text" id="fornecedor-contato" value="${fornecedor.contato}" required>
                </div>
                
                <div class="form-group">
                    <label for="fornecedor-email">Email</label>
                    <input type="email" id="fornecedor-email" value="${fornecedor.email}" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Salvar</button>
                <button type="button" id="cancelar-fornecedor" class="btn">Cancelar</button>
            </form>
        `;

        document.getElementById('fornecedor-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFornecedor();
        });

        document.getElementById('cancelar-fornecedor').addEventListener('click', () => this.render());
    }

    static async saveFornecedor() {
        const id = document.getElementById('fornecedor-id').value || null;
        const fornecedor = {
            nome: document.getElementById('fornecedor-nome').value,
            cnpj: document.getElementById('fornecedor-cnpj').value,
            contato: document.getElementById('fornecedor-contato').value,
            email: document.getElementById('fornecedor-email').value
        };

        try {
            if (id) {
                await api.updateFornecedor(id, fornecedor);
            } else {
                await api.createFornecedor(fornecedor);
            }
            this.render();
        } catch (error) {
            console.error('Erro ao salvar fornecedor:', error);
            alert('Erro ao salvar fornecedor');
        }
    }

    static async deleteFornecedor(id) {
        if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
            try {
                await api.deleteFornecedor(id);
                this.render();
            } catch (error) {
                console.error('Erro ao excluir fornecedor:', error);
                alert('Erro ao excluir fornecedor');
            }
        }
    }
}