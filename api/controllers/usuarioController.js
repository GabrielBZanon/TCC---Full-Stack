const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// Função melhorada para criar usuário
const createUser = async (req, res) => {
    try {
        const { nome, email, senha, cargo } = req.body;

        if (!nome || !email || !senha || !cargo) {
            return res.status(400).json({ 
                error: 'Todos os campos são obrigatórios',
                campos: { nome, email, senha, cargo }
            });
        }

        // Validação de e-mail simples
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'E-mail inválido' });
        }

        // Verifica se usuário já existe
        const usuarioExistente = await prisma.usuario.findUnique({ 
            where: { email } 
        });

        if (usuarioExistente) {
            return res.status(409).json({ error: 'E-mail já cadastrado' });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Cria o novo usuário
        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                cargo
            }
        });

        // Remove a senha do retorno
        const { senha: _, ...usuarioSemSenha } = novoUsuario;

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            usuario: usuarioSemSenha
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ 
            error: 'Erro interno no servidor',
            detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Função melhorada para login
const loginUser = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
        }

        // Busca o usuário
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { 
                id: usuario.id,
                email: usuario.email,
                cargo: usuario.cargo 
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Remove a senha do retorno
        const { senha: _, ...usuarioSemSenha } = usuario;

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            usuario: usuarioSemSenha,
            expiresIn: 28800 // 8 horas em segundos
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            error: 'Erro interno no servidor',
            detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Função para listar usuários (protegida)
const getUsers = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                cargo: true,
                criadoEm: true
            }
        });

        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ 
            error: 'Erro interno no servidor',
            detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    create: createUser,
    login: loginUser,
    read: getUsers
};