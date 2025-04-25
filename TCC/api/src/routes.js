const express = require('express');
const routes = express.Router();

const Produto = require('./controllers/produto')
const Movimentacao = require('./controllers/movimentacao')
const Fornecedor = require('./controllers/fornecedor')
const Reposicao = require('./controllers/reposicao')

routes.get('/', (req, res) => {
    res.send('API Respondendo...');
});

routes.post('/pedidos', Produto.create)
routes.get('/pedidos', Produto.read)
routes.put('/produtos/:id', Produto.update)
routes.delete('/produtos/:id', Produto.del)

routes.post('/movimentacoes', Movimentacao.create)
routes.get('/movimentacoes', Movimentacao.read)
routes.put('/movimentacoes/:id', Movimentacao.update)
routes.delete('/movimentacoes/:id', Movimentacao.del)

routes.post('/fornecedores', Fornecedor.create)
routes.get('/fornecedores', Fornecedor.read)
routes.put('/fornecedores/:id', Fornecedor.update)
routes.delete('/fornecedores/:id', Fornecedor.del)

routes.post('/reposicoes', Reposicao.create)
routes.get('/reposicoes', Reposicao.read)
routes.put('/resposicoes/:id', Reposicao.update)
routes.delete('/reposicoes/:id', Reposicao.del)

module.exports = routes;