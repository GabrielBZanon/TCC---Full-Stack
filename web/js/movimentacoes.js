document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticação
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos do modal
    const modal = document.getElementById('modalMovimentacao');
    const btnNova = document.getElementById('btnNovaMovimentacao');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('formMovimentacao');
    const selectProduto = document.getElementById('movimentacaoProduto');

    // Carrega lista de produtos
    try {
        const response = await fetch('/api/produtos', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const produtos = await response.json();
        
        selectProduto.innerHTML = produtos.map(produto => 
            `<option value="${produto.id}">${produto.nome}</option>`
        ).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }

    // Abre modal para nova movimentação
    btnNova.onclick = () => {
        document.getElementById('modalTitulo').textContent = 'Nova Movimentação';
        form.reset();
        modal.style.display = 'block';
    };

    // Fecha modal
    span.onclick = () => {
        modal.style.display = 'none';
    };

    // Fecha modal ao clicar fora
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Carrega movimentações
    carregarMovimentacoes();

    // Manipula envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const movimentacao = {
            tipo: document.getElementById('movimentacaoTipo').value,
            quantidade: parseInt(document.getElementById('movimentacaoQuantidade').value),
            produtoId: parseInt(document.getElementById('movimentacaoProduto').value)
        };

        try {
            const response = await fetch('/api/movimentacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(movimentacao)
            });

            if (!response.ok) throw new Error('Erro ao registrar movimentação');

            modal.style.display = 'none';
            carregarMovimentacoes();
        } catch (error) {
            alert(error.message);
        }
    });
});

async function carregarMovimentacoes() {
    try {
        const response = await fetch('/api/movimentacoes', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const movimentacoes = await response.json();
        
        const tbody = document.querySelector('#tabelaMovimentacoes tbody');
        tbody.innerHTML = movimentacoes.map(mov => `
            <tr>
                <td>${mov.id}</td>
                <td>${new Date(mov.createdAt).toLocaleString()}</td>
                <td>${mov.tipo}</td>
                <td>${mov.produto.nome}</td>
                <td>${mov.quantidade}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar movimentações:', error);
    }
}