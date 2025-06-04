const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const movimentacao = await prisma.movimentacoes.create({
            data: req.body
        });
        return res.status(201).json(movimentacao);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const read = async (req, res) => {
    const movimentacoes = await prisma.movimentacoes.findMany({
        include: { produto: true }
    });
    return res.json(movimentacoes);
};

const readOne = async (req, res) => {
    try {
        const movimentacao = await prisma.movimentacoes.findUnique({
            where: { id: Number(req.params.id) },
            include: { produto: true }
        });
        return res.json(movimentacao);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const movimentacao = await prisma.movimentacoes.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        return res.status(202).json(movimentacao);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await prisma.movimentacoes.delete({
            where: { id: Number(req.params.id) }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

module.exports = { create, read, readOne, update, remove };
