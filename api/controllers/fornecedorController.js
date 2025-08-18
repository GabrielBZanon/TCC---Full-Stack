const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
  const { nome, cnpj, contato, email } = req.body;

  if (!nome || !cnpj || !contato || !email) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const fornecedor = await prisma.fornecedor.create({ data: req.body });
    return res.status(201).json(fornecedor);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const read = async (req, res) => {
  const fornecedores = await prisma.fornecedor.findMany();
  return res.json(fornecedores);
};

const readOne = async (req, res) => {
  try {
    const fornecedor = await prisma.fornecedor.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!fornecedor) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    return res.json(fornecedor);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const fornecedor = await prisma.fornecedor.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    return res.status(200).json(fornecedor);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await prisma.fornecedor.delete({
      where: { id: Number(req.params.id) },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

module.exports = { create, read, readOne, update, remove };
