document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar dados do dashboard
    await loadDashboardData();
    
    // Configurar gráficos
    setupCharts();
});

async function loadDashboardData() {
    try {
        // Carregar contagem de produtos
        const produtosResponse = await makeAuthenticatedRequest('/produtos');
        if (produtosResponse && produtosResponse.ok) {
            const produtos = await produtosResponse.json();
            document.getElementById('totalProdutos').textContent = produtos.length;
            
            // Agrupar por local de estoque para o gráfico
            const estoqueData = {};
            produtos.forEach(produto => {
                if (!estoqueData[produto.localEstoque]) {
                    estoqueData[produto.localEstoque] = 0;
                }
                estoqueData[produto.localEstoque]++;
            });
            
            // Configurar dados do gráfico
            window.estoqueChartData = {
                labels: Object.keys(estoqueData),
                datasets: [{
                    data: Object.values(estoqueData),
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#f39c12',
                        '#e74c3c',
                        '#9b59b6'
                    ]
                }]
            };
        }
        
        // Carregar contagem de fornecedores
        const fornecedoresResponse = await makeAuthenticatedRequest('/fornecedores');
        if (fornecedoresResponse && fornecedoresResponse.ok) {
            const fornecedores = await fornecedoresResponse.json();
            document.getElementById('totalFornecedores').textContent = fornecedores.length;
        }
        
        // Carregar últimas movimentações
        const movimentacoesResponse = await makeAuthenticatedRequest('/movimentacoes');
        if (movimentacoesResponse && movimentacoesResponse.ok) {
            const movimentacoes = await movimentacoesResponse.json();
            document.getElementById('totalMovimentacoes').textContent = movimentacoes.length;
            
            // Exibir últimas 5 movimentações
            const ultimas = movimentacoes.slice(0, 5);
            const movimentacoesList = document.getElementById('ultimasMovimentacoes');
            
            movimentacoesList.innerHTML = '';
            ultimas.forEach(mov => {
                const div = document.createElement('div');
                div.className = 'movimentacao-item';
                div.innerHTML = `
                    <div class="movimentacao-tipo ${mov.tipo === 'ENTRADA' ? 'entrada' : 'saida'}">
                        ${mov.tipo === 'ENTRADA' ? '<i class="fas fa-arrow-down"></i>' : '<i class="fas fa-arrow-up"></i>'}
                    </div>
                    <div class="movimentacao-info">
                        <strong>${mov.produto.nome}</strong>
                        <span>${mov.quantidade} unidades</span>
                    </div>
                    <div class="movimentacao-data">
                        ${new Date(mov.data).toLocaleDateString()}
                    </div>
                `;
                movimentacoesList.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
}

function setupCharts() {
    const ctx = document.getElementById('estoqueChart').getContext('2d');
    
    if (window.estoqueChart) {
        window.estoqueChart.destroy();
    }
    
    window.estoqueChart = new Chart(ctx, {
        type: 'doughnut',
        data: window.estoqueChartData || {
            labels: ['Setor A', 'Setor B', 'Setor C'],
            datasets: [{
                data: [10, 20, 15],
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f39c12'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}