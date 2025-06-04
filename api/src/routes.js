const express = require('express');
const router = express.Router();

const controllerProdutos = require('./controller/controllerProdutos');
const controllerFornecedores = require('./controller/controllerFornecedores');
const controllerMovimentacao = require('./controller/controllerMovimentacao');
const usuarioController = require('./controller/controllerUsuario');

// Produtos
router.post('/produtos', controllerProdutos.create);
router.get('/produtos', controllerProdutos.read);
router.get('/produtos/:id', controllerProdutos.readOne);
router.put('/produtos/:id', controllerProdutos.update);
router.delete('/produtos/:id', controllerProdutos.remove);

// Fornecedores
router.post('/fornecedores', controllerFornecedores.create);
router.get('/fornecedores', controllerFornecedores.read);
router.get('/fornecedores/:id', controllerFornecedores.readOne);
router.put('/fornecedores/:id', controllerFornecedores.update);
router.delete('/fornecedores/:id', controllerFornecedores.remove);

// Movimentações
router.post('/movimentacoes', controllerMovimentacao.create);
router.get('/movimentacoes', controllerMovimentacao.read);
router.get('/movimentacoes/:id', controllerMovimentacao.readOne);
router.put('/movimentacoes/:id', controllerMovimentacao.update);
router.delete('/movimentacoes/:id', controllerMovimentacao.remove);

// Usuários
router.post('/usuarios', usuarioController.create);
router.get('/usuarios', usuarioController.read);
router.get('/usuarios/:id', usuarioController.readOne);
router.put('/usuarios/:id', usuarioController.update);
router.delete('/usuarios/:id', usuarioController.remove);


module.exports = router;
