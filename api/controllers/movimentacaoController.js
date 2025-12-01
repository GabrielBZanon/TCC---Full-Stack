const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
  const { tipo, quantidade, produtoId } = req.body;

  if (!tipo || !quantidade || !produtoId) {
    return res.status(400).json({ error: 'Campos obrigatórios não informados' });
  }

  try {
    const produto = await prisma.produto.findFirst({
      where: {
        id: Number(produtoId)
      }
    })

    if (tipo == 'ENTRADA') {
      produto.quantidade += Number(quantidade)
      await prisma.produto.update({
        where:{
          id: Number(produtoId)
        },
        data: {
          quantidade: produto.quantidade
        }
      })
    }

    const movimentacao = await prisma.movimentacao.create({
      data: req.body,
    });
    return res.status(201).json(movimentacao);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const read = async (req, res) => {
  const movimentacoes = await prisma.movimentacao.findMany({ include: { produto: true } });
  return res.json(movimentacoes);
};

module.exports = { create, read };
