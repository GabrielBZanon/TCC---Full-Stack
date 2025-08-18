const prisma = require('../prismaClient.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async login(req, res) {
        const { email, senha } = req.body;

        try {

            const usuario = await prisma.usuario.findUnique({
                where: { email }
            });

            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ error: 'Senha inválida' });
            }
            const token = jwt.sign(
                { id: usuario.id, email: usuario.email }, // <-- precisa ter o id!
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );


            return res.status(200).json({ message: 'Login bem-sucedido', token });
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no login' });
        }
    }
};
