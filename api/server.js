require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ 
  origin: 'http://127.0.0.1:5500', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const routes = require('./routes/routes');
app.use('/api', routes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'online',
      database: 'connected',
      timestamp: new Date() 
    });
  } catch (error) {
    res.status(500).json({
      status: 'offline',
      error: 'Database connection failed'
    });
  }
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Banco de dados conectado');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Falha na inicialização:');
    console.error(error);
    process.exit(1);
  }
}

startServer();

// 👉 Adicionado: exporta o app para o Vercel usar como Serverless
module.exports = app;
