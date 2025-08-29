const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const loginController = require('../controllers/loginController');
const usuarioController = require('../controllers/usuarioController');
const produtoController = require('../controllers/produtoController');
const fornecedorController = require('../controllers/fornecedorController');
const movimentacaoController = require('../controllers/movimentacaoController');

// ROTAS PÚBLICAS (não precisam de token)
router.post('/usuarios', usuarioController.cadastrarUsuario);
router.post('/usuarios/login', usuarioController.login);
router.post('/login', loginController.login); // caso use esse também

// ROTAS PROTEGIDAS (precisam de token)
router.use(authMiddleware);

router.post('/produtos', produtoController.create);
router.get('/produtos', produtoController.read);
router.get('/produtos/:id', produtoController.readOne);
router.put('/produtos/:id', produtoController.update);
router.delete('/produtos/:id', produtoController.remove);

router.post('/fornecedores', fornecedorController.create);
router.get('/fornecedores', fornecedorController.read);
router.get('/fornecedores/:id', fornecedorController.readOne);
router.put('/fornecedores/:id', fornecedorController.update);
router.delete('/fornecedores/:id', fornecedorController.remove);

router.post('/movimentacoes', movimentacaoController.create);
router.get('/movimentacoes', movimentacaoController.read);

module.exports = router;
