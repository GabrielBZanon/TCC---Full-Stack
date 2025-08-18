export class MovimentacoesModule {
    static async render() {
        const content = document.getElementById('app-content');
        content.innerHTML = `
            <h2>Movimentações</h2>
            <button id="nova-movimentacao" class="btn btn-primary">Nova Movimentação</button>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Produto</th>
                        <th>Quantidade</th>
                    </tr>
                </thead>
                <tbody id="movimentacoes-table-body">
                    <!-- Dados serão carregados aqui -->
                </tbody>
            </table>
        `;

        await this.loadMovimentacoes();

        document.getElementById('nova-movimentacao').addEventListener('click', () => this.renderForm());
    }

    static async loadMovimentacoes() {
        try {
            const movimentacoes = await api.getMovimentacoes();
            const tableBody = document.getElementById('movimentacoes-table-body');
            
            tableBody.innerHTML = movimentacoes.map(mov => `
                <tr>
                    <td>${mov.id}</td>
                    <td>${new Date(mov.createdAt).toLocaleString()}</td>
                    <td>${mov.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}</td>
                    <td>${mov.produto.nome}</td>
                    <td>${mov.quantidade}</td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Erro ao carregar movimentações:', error);
            alert('Erro ao carregar movimentações');
        }
    }

    static async renderForm() {
        let produtos = [];
        
        try {
            produtos = await api.getProdutos();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            alert('Erro ao carregar formulário');
            return;
        }

        const content = document.getElementById('app-content');
        content.innerHTML = `
            <h2>Nova Movimentação</h2>
            <form id="movimentacao-form">
                <div class="form-group">
                    <label for="movimentacao-tipo">Tipo</label>
                    <select id="movimentacao-tipo" required>
                        <option value="">Selecione o tipo</option>
                        <option value="ENTRADA">Entrada</option>
                        <option value="SAIDA">Saída</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="movimentacao-produto">Produto</label>
                    <select id="movimentacao-produto" required>
                        <option value="">Selecione um produto</option>
                        ${produtos.map(p => `
                            <option value="${p.id}">${p.nome} (Estoque: ${p.quantidade})</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="movimentacao-quantidade">Quantidade</label>
                    <input type="number" id="movimentacao-quantidade" min="1" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Salvar</button>
                <button type="button" id="cancelar-movimentacao" class="btn">Cancelar</button>
            </form>
        `;

        document.getElementById('movimentacao-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMovimentacao();
        });

        document.getElementById('cancelar-movimentacao').addEventListener('click', () => this.render());
    }

    static async saveMovimentacao() {
        const movimentacao = {
            tipo: document.getElementById('movimentacao-tipo').value,
            produtoId: parseInt(document.getElementById('movimentacao-produto').value),
            quantidade: parseInt(document.getElementById('movimentacao-quantidade').value)
        };

        try {
            await api.createMovimentacao(movimentacao);
            this.render();
        } catch (error) {
            console.error('Erro ao salvar movimentação:', error);
            alert('Erro ao salvar movimentação');
        }
    }
}