const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        erro: 'Todos os campos são obrigatórios',
        campos: { nome, email, senha }
      });
    }

    // Verifica se usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }

    // Criptografa senha
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    // Cria novo usuário
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash
      }
    });

    // Remove senha do retorno
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
  // Implementação do login aqui
};

module.exports = {
  cadastrarUsuario,
  login
};