const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const loginController = require('../controllers/loginController');
const usuarioController = require('../controllers/usuarioController');
const produtoController = require('../controllers/produtoController');
const fornecedorController = require('../controllers/fornecedorController');
const movimentacaoController = require('../controllers/movimentacaoController');

//Rota raiz de testes
router.get('/', (req, res) => {
    res.json({
        title: 'API de Gerenciamento de Estoque',
        version: '1.0.0',
        rotas: [
            { metodo: 'POST', endpoint: '/usuarios', descricao: 'Cadastrar novo usuário' },
            { metodo: 'POST', endpoint: '/usuarios/login', descricao: 'Login de usuário' },
            { metodo: 'POST', endpoint: '/login', descricao: 'Login de usuário (alternativo)' },
            { metodo: 'POST', endpoint: '/produtos', descricao: 'Criar novo produto' },
            { metodo: 'GET', endpoint: '/produtos', descricao: 'Listar todos os produtos' },
            { metodo: 'GET', endpoint: '/produtos/:id', descricao: 'Obter detalhes de um produto' },
            { metodo: 'PUT', endpoint: '/produtos/:id', descricao: 'Atualizar um produto' },
            { metodo: 'DELETE', endpoint: '/produtos/:id', descricao: 'Deletar um produto' },
            { metodo: 'POST', endpoint: '/fornecedores', descricao: 'Criar novo fornecedor' },
            { metodo: 'GET', endpoint: '/fornecedores', descricao: 'Listar todos os fornecedores' },
            { metodo: 'GET', endpoint: '/fornecedores/:id', descricao: 'Obter detalhes de um fornecedor' },
            { metodo: 'PUT', endpoint: '/fornecedores/:id', descricao: 'Atualizar um fornecedor' },
            { metodo: 'DELETE', endpoint: '/fornecedores/:id', descricao: 'Deletar um fornecedor' },
            { metodo: 'POST', endpoint: '/movimentacoes', descricao: 'Registrar nova movimentação de estoque' },
            { metodo: 'GET', endpoint: '/movimentacoes', descricao: 'Listar todas as movimentações de estoque' }
        ]

    });
});

// ROTAS PÚBLICAS (não precisam de token)
router.get('/usuarios', authMiddleware, usuarioController.listarUsuarios); // caso use esse também
router.post('/usuarios', usuarioController.cadastrarUsuario);
router.post('/login', loginController.login); // caso use esse também

// ROTAS PROTEGIDAS (precisam de token) descomentar no sprint final
// router.use(authMiddleware);

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
