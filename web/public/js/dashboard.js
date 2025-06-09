    document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados do dashboard
    try {
        // Carregar contagem de produtos
        const produtosResponse = await makeAuthenticatedRequest('/produtos');
        if (produtosResponse && produtosResponse.ok) {
            const produtos = await produtosResponse.json();
            document.getElementById('totalProdutos').textContent = produtos.length;
            
            // Agrupar por local de estoque
            const estoqueData = produtos.reduce((acc, produto) => {
                acc[produto.localEstoque] = (acc[produto.localEstoque] || 0) + 1;
                return acc;
            }, {});
            
            // Configurar gráfico
            renderChart(estoqueData);
        }

        // Carregar contagem de fornecedores
        const fornecedoresResponse = await makeAuthenticatedRequest('/fornecedores');
        if (fornecedoresResponse && fornecedoresResponse.ok) {
            const fornecedores = await fornecedoresResponse.json();
            document.getElementById('totalFornecedores').textContent = fornecedores.length;
        }

        // Carregar movimentações recentes
        const movimentacoesResponse = await makeAuthenticatedRequest('/movimentacoes');
        if (movimentacoesResponse && movimentacoesResponse.ok) {
            const movimentacoes = await movimentacoesResponse.json();
            document.getElementById('totalMovimentacoes').textContent = movimentacoes.length;
            
            // Exibir últimas 5 movimentações
            renderLastMovements(movimentacoes.slice(0, 5));
        }
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showError('Erro ao carregar dados do dashboard');
    }
});

function renderChart(estoqueData) {
    const ctx = document.getElementById('estoqueChart').getContext('2d');
    
    if (window.estoqueChart) {
        window.estoqueChart.destroy();
    }
    
    window.estoqueChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
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
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderLastMovements(movimentacoes) {
    const container = document.getElementById('ultimasMovimentacoes');
    container.innerHTML = '';
    
    movimentacoes.forEach(mov => {
        const movementElement = document.createElement('div');
        movementElement.className = 'movimentacao-item';
        movementElement.innerHTML = `
            <div class="movimentacao-icon ${mov.tipo.toLowerCase()}">
                <i class="fas fa-${mov.tipo === 'ENTRADA' ? 'arrow-down' : 'arrow-up'}"></i>
            </div>
            <div class="movimentacao-info">
                <strong>${mov.produto.nome}</strong>
                <span>${mov.quantidade} unidades</span>
            </div>
            <div class="movimentacao-data">
                ${new Date(mov.data).toLocaleDateString()}
            </div>
        `;
        container.appendChild(movementElement);
    });
}