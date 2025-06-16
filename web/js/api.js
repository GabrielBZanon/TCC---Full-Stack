// api.js - Client-side API Service para SmartSupply

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async _fetch(endpoint, method = 'GET', body = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na requisição');
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição ${endpoint}:`, error);
      throw error;
    }
  }

  // ========== Autenticação ==========
  async login(email, password) {
    return this._fetch('/auth/login', 'POST', { email, password });
  }

  // ========== Produtos ==========
  async getProdutos() {
    return this._fetch('/produtos');
  }

  async createProduto(produtoData) {
    return this._fetch('/produtos', 'POST', produtoData);
  }

  async updateProduto(id, produtoData) {
    return this._fetch(`/produtos/${id}`, 'PUT', produtoData);
  }

  async deleteProduto(id) {
    return this._fetch(`/produtos/${id}`, 'DELETE');
  }

  // ========== Fornecedores ==========
  async getFornecedores() {
    return this._fetch('/fornecedores');
  }

  async createFornecedor(fornecedorData) {
    return this._fetch('/fornecedores', 'POST', fornecedorData);
  }

  async updateFornecedor(id, fornecedorData) {
    return this._fetch(`/fornecedores/${id}`, 'PUT', fornecedorData);
  }

  async deleteFornecedor(id) {
    return this._fetch(`/fornecedores/${id}`, 'DELETE');
  }

  // ========== Movimentações ==========
  async getMovimentacoes() {
    return this._fetch('/movimentacoes');
  }

  async createMovimentacao(movimentacaoData) {
    return this._fetch('/movimentacoes', 'POST', movimentacaoData);
  }

  // ========== Dashboard ==========
  async getDashboardData() {
    return this._fetch('/dashboard');
  }
}

// Singleton pattern para garantir uma única instância
const apiService = new ApiService();

// Atualiza o token quando o usuário faz login
function updateAuthToken(token) {
  apiService.token = token;
  localStorage.setItem('token', token);
}

// Exporta a instância única
export default apiService;