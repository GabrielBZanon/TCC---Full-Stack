const express = require('express');
const router = express.Router();

// Controllers (corrigindo os caminhos)
const fornecedorController = require('../controllers/fornecedorController');
const movimentacaoController = require('../controllers/movimentacaoController');
const produtoController = require('../controllers/produtoController');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware')


// Fornecedores
router.post('/fornecedores', fornecedorController.create);
router.get('/fornecedores', fornecedorController.read);
router.get('/fornecedores/:id', fornecedorController.readOne);
router.put('/fornecedores/:id', fornecedorController.update);
router.delete('/fornecedores/:id', fornecedorController.remove);

// Produtos
router.post('/produtos', produtoController.create);
router.get('/produtos', produtoController.read);
router.get('/produtos/:id', produtoController.readOne);
router.put('/produtos/:id', produtoController.update);
router.delete('/produtos/:id', produtoController.remove);
router.post('/produtos', authMiddleware, produtoController.create);


// Movimentações
router.post('/movimentacoes', movimentacaoController.create);
router.get('/movimentacoes', movimentacaoController.read);

router.use(authMiddleware); // tudo abaixo será protegido
router.post('/produtos', produtoController.create);
router.get('/produtos', produtoController.read);
// ...


// Usuários
router.post('/usuarios', usuarioController.create);
router.get('/usuarios', usuarioController.read);

module.exports = router;
