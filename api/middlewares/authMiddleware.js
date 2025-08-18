const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Token não fornecido ou formato inválido',
            solução: 'Envie o token no formato: Bearer <token>'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const usuario = await prisma.usuario.findUnique({
            where: { id: decoded.usuario.id },
            select: { id: true, email: true, cargo: true }
        });

        if (!usuario) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        req.user = usuario;
        next();

    } catch (error) {
        console.error('Erro na autenticação:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }

        res.status(500).json({
            error: 'Erro na autenticação',
            detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = authMiddleware;