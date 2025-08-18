const { PrismaClient } = require('@prisma/client');

const bcrypt = require('bcryptjs');
const jsonwebtoken = require("jsonwebtoken");

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: 'Todos os campos são obrigatórios',
        campos: { nome, email, senha }
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash
      }
    });

    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      usuario: usuarioSemSenha
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: 'Email e senha são obrigatórios'
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos'
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos'
      });
    }

    const { senha: _, ...usuarioSemSenha } = usuario;
 
    const token = jsonwebtoken.sign(
      { usuario: usuarioSemSenha },
      process.env.JWT_SECRET || 'segredo',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      erro: 'Erro interno no servidor'
    });
  }
};

module.exports = {
  cadastrarUsuario,
  login
};