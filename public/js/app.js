import { api } from './api.js';
import * as auth from './auth.js';
import { ProdutosModule } from './modules/produtos.js';
import { FornecedoresModule } from './modules/fornecedores.js';
import { MovimentacoesModule } from './modules/movimentacoes.js';

class App {
    static async init() {
        // Verifica autenticação
        if (!auth.isAuthenticated()) {
            window.location.href = '/login.html';
            return;
        }

        // Carrega informações do usuário
        await this.loadUserInfo();

        // Configura navegação
        this.setupNavigation();

        // Roteamento inicial
        await this.route();
    }

    static async loadUserInfo() {
        try {
            const user = await api.getCurrentUser();
            document.getElementById('user-welcome').innerHTML = `
                <p>Bem vindo ao sistema, ${user.nome}!</p>
            `;
        } catch (error) {
            console.error('Erro ao carregar informações do usuário:', error);
        }
    }

    static setupNavigation() {
        // Navegação SPA
        document.querySelectorAll('[data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                window.history.pushState({ route }, '', `/${route}`);
                this.route();
            });
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });

        // Manipula o botão voltar/avançar do navegador
        window.addEventListener('popstate', () => this.route());
    }

    static async route() {
        const path = window.location.pathname.split('/').pop() || 'dashboard';
        
        document.getElementById('app-content').innerHTML = '<div class="loading">Carregando...</div>';
        
        try {
            switch(path) {
                case 'produtos':
                    await ProdutosModule.render();
                    break;
                case 'fornecedores':
                    await FornecedoresModule.render();
                    break;
                case 'movimentacoes':
                    await MovimentacoesModule.render();
                    break;
                case 'dashboard':
                default:
                    await this.renderDashboard();
            }
        } catch (error) {
            console.error('Erro ao carregar rota:', error);
            document.getElementById('app-content').innerHTML = `
                <div class="error">Erro ao carregar a página</div>
            `;
        }
    }

    static async renderDashboard() {
        const [produtos, movimentacoes] = await Promise.all([
            api.getProdutos(),
            api.getMovimentacoes()
        ]);

        const content = document.getElementById('app-content');
        content.innerHTML = `
            <div class="dashboard-section">
                <h2>Produtos</h2>
                ${produtos.slice(0, 3).map(produto => `
                    <div class="dashboard-card">
                        <h3>${produto.nome}</h3>
                        <p>Estoque: ${produto.quantidade}</p>
                        <p>Local: ${produto.localEstoque}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="dashboard-section">
                <h2>Movimentações</h2>
                ${movimentacoes.slice(0, 1).map(mov => `
                    <div class="dashboard-card">
                        <p><strong>${mov.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}</strong></p>
                        <p>Produto: ${mov.produto.nome}</p>
                        <p>Quantidade: ${mov.quantidade}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => App.init());