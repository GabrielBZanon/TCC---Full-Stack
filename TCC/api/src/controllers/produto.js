const con = require('../connect');

async function create(req, res) {
    const {
        nome,
        descricao,
        codigo_barras,
        quantidade_estoque,
        quantidade_minima,
        unidade_medida,
        preco_unitario,
        categoria,
        data_cadastro
    } = req.body;

    if (!nome || !descricao || !codigo_barras) {
        return res.status(400).json('Dados obrigatórios não fornecidos');
    }

    const sql = `INSERT INTO produtos (
        nome,
        descricao,
        codigo_barras,
        quantidade_estoque,
        quantidade_minima,
        unidade_medida,
        preco_unitario,
        categoria,
        data_cadastro
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        await con.query(sql, [nome, descricao, codigo_barras, quantidade_estoque, quantidade_minima, unidade_medida, preco_unitario, categoria, data_cadastro]);
        res.status(201).json('Produto cadastrado com sucesso');
    } catch (error) {
        res.status(500).json('Erro ao cadastrar produto');
    }
}

async function read(req, res) {
    const sql = 'SELECT * FROM produtos';
    try {
        const result = await con.query(sql);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json('Erro ao consultar produtos');
    }
}

async function update(req, res) {
    const { id } = req.params;
    const {
        nome,
        descricao,
        codigo_barras,
        quantidade_estoque,
        quantidade_minima,
        unidade_medida,
        preco_unitario,
        categoria,
        data_cadastro
    } = req.body;

    const sql = `UPDATE produtos SET 
        nome = ?, 
        descricao = ?, 
        codigo_barras = ?, 
        quantidade_estoque = ?, 
        quantidade_minima = ?, 
        unidade_medida = ?, 
        preco_unitario = ?, 
        categoria = ?, 
        data_cadastro = ? 
        WHERE id_produto = ?`;

    try {
        await con.query(sql, [nome, descricao, codigo_barras, quantidade_estoque, quantidade_minima, unidade_medida, preco_unitario, categoria, data_cadastro, id]);
        res.status(202).json('Produto alterado com sucesso');
    } catch (error) {
        res.status(500).json('Erro ao alterar produto');
    }
}

async function del(req, res) {
    const { id } = req.params;
    const sql = 'DELETE FROM produtos WHERE id_produto = ?';

    try {
        await con.query(sql, [id]);
        res.status(200).json('Produto deletado com sucesso');
    } catch (error) {
        res.status(500).json('Erro ao deletar produto');
    }
}