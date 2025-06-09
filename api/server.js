const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/routes');


const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Smart Supply API rodando com sucesso!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
