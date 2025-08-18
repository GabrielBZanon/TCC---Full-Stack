const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
  const { nome, descricao, codigoBarras, quantidade, localEstoque, fornecedorId } = req.body;

  if (!nome || !descricao || !codigoBarras || !quantidade || !localEstoque || !fornecedorId) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const produto = await prisma.produto.create({ data: req.body });
    return res.status(201).json(produto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const read = async (req, res) => {
  const produtos = await prisma.produto.findMany({ include: { fornecedor: true } });
  return res.json(produtos);
};

const readOne = async (req, res) => {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: Number(req.params.id) },
      include: { fornecedor: true },
    });
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    return res.json(produto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const produto = await prisma.produto.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    return res.status(200).json(produto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await prisma.produto.delete({
      where: { id: Number(req.params.id) },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

module.exports = { create, read, readOne, update, remove };
