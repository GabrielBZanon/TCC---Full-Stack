const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const produto = await prisma.produtos.create({
            data: req.body
        });
        return res.status(201).json(produto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const read = async (req, res) => {
    const produtos = await prisma.produtos.findMany({
        include: { fornecedor: true }
    });
    return res.json(produtos);
};

const readOne = async (req, res) => {
    try {
        const produto = await prisma.produtos.findUnique({
            where: { id: Number(req.params.id) },
            include: { fornecedor: true }
        });
        return res.json(produto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const produto = await prisma.produtos.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        return res.status(202).json(produto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await prisma.produtos.delete({
            where: { id: Number(req.params.id) }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

module.exports = { create, read, readOne, update, remove };
