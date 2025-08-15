const API_BASE = '/api';

export const api = {
    // Autenticação
    async login(email, password) {
        const response = await fetch(`${API_BASE}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    },

    // Usuário atual
    async getCurrentUser() {
        return await this._authRequest(`${API_BASE}/usuarios/me`, 'GET');
    },

    // Produtos
    async getProdutos() {
        return await this._authRequest(`${API_BASE}/produtos`, 'GET');
    },

    async createProduto(produto) {
        return await this._authRequest(`${API_BASE}/produtos`, 'POST', produto);
    },

    async updateProduto(id, produto) {
        return await this._authRequest(`${API_BASE}/produtos/${id}`, 'PUT', produto);
    },

    async deleteProduto(id) {
        return await this._authRequest(`${API_BASE}/produtos/${id}`, 'DELETE');
    },

    // Fornecedores
    async getFornecedores() {
        return await this._authRequest(`${API_BASE}/fornecedores`, 'GET');
    },

    async createFornecedor(fornecedor) {
        return await this._authRequest(`${API_BASE}/fornecedores`, 'POST', fornecedor);
    },

    async updateFornecedor(id, fornecedor) {
        return await this._authRequest(`${API_BASE}/fornecedores/${id}`, 'PUT', fornecedor);
    },

    async deleteFornecedor(id) {
        return await this._authRequest(`${API_BASE}/fornecedores/${id}`, 'DELETE');
    },

    // Movimentações
    async getMovimentacoes() {
        return await this._authRequest(`${API_BASE}/movimentacoes`, 'GET');
    },

    async createMovimentacao(movimentacao) {
        return await this._authRequest(`${API_BASE}/movimentacoes`, 'POST', movimentacao);
    },

    // Método privado para requests autenticados
    async _authRequest(url, method, body = null) {
        const token = localStorage.getItem('token');
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        
        if (body) options.body = JSON.stringify(body);
        
        const response = await fetch(url, options);
        
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }
        
        return await response.json();
    }
};