const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Importe seus controllers
const usuarioController = require('../controllers/usuarioController');
const produtoController = require('../controllers/produtoController');
const fornecedorController = require('../controllers/fornecedorController');
const movimentacaoController = require('../controllers/movimentacaoController');

// Rotas públicas
router.post('/usuarios', usuarioController.create);
router.post('/usuarios/login', usuarioController.login);

// Rotas protegidas (requerem autenticação)
router.use(authMiddleware);

// Rotas de usuários
router.get('/usuarios', usuarioController.read);

// Rotas de produtos
router.post('/produtos', produtoController.create);
router.get('/produtos', produtoController.read);
router.get('/produtos/:id', produtoController.readOne);
router.put('/produtos/:id', produtoController.update);
router.delete('/produtos/:id', produtoController.remove);

// Rotas de fornecedores
router.post('/fornecedores', fornecedorController.create);
router.get('/fornecedores', fornecedorController.read);
router.get('/fornecedores/:id', fornecedorController.readOne);
router.put('/fornecedores/:id', fornecedorController.update);
router.delete('/fornecedores/:id', fornecedorController.remove);

// Rotas de movimentações
router.post('/movimentacoes', movimentacaoController.create);
router.get('/movimentacoes', movimentacaoController.read);

module.exports = router;