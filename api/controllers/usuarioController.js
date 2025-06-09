const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const prisma = new PrismaClient();

module.exports = {
  // Criar novo usuário
  async create(req, res) {
    try {
      const { nome, email, senha } = req.body;

      const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });

      if (usuarioExistente) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
        },
      });

      res.status(201).json(novoUsuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await prisma.usuario.findUnique({ where: { email } });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      const token = generateToken(usuario.id);

      res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  },

  // Listar usuários (opcional — pode ser protegido por autenticação)
  async read(req, res) {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
        },
      });

      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  },
};
