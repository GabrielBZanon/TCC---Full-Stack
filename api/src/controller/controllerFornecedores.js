const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const fornecedor = await prisma.fornecedores.create({
            data: req.body
        });
        return res.status(201).json(fornecedor);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const read = async (req, res) => {
    const fornecedores = await prisma.fornecedores.findMany();
    return res.json(fornecedores);
};

const readOne = async (req, res) => {
    try {
        const fornecedor = await prisma.fornecedores.findUnique({
            where: { id: Number(req.params.id) }
        });
        return res.json(fornecedor);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const fornecedor = await prisma.fornecedores.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        return res.status(202).json(fornecedor);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await prisma.fornecedores.delete({
            where: { id: Number(req.params.id) }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

module.exports = { create, read, readOne, update, remove };
