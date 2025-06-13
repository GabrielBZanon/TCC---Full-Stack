require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração básica de middlewares
app.use(express.json());

// Teste de conexão com o banco
async function testDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Banco de dados conectado');
  } catch (error) {
    console.error('❌ Falha na conexão com o banco:');
    console.error(error.message);
    console.log('\nSoluções possíveis:');
    console.log('1. Verifique se o MySQL está rodando');
    console.log('2. Confira o DATABASE_URL no .env');
    console.log('3. Execute as migrations: npx prisma migrate dev');
    process.exit(1);
  }
}

// Rota de health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date() 
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// Inicialização segura
async function startServer() {
  await testDatabase();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    console.error('Erro no servidor:');
    console.error(error.code === 'EADDRINUSE' 
      ? `⚠️  Porta ${PORT} já em uso!` 
      : error.message);
    
    process.exit(1);
  });
}

startServer().catch(error => {
  console.error('Falha crítica:');
  console.error(error);
  process.exit(1);
});