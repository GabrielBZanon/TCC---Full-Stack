const express = require('express');
const cors = require('cors');
const port = 5000;
const routes = require('./src/routes');

const app = express();

app.use(express.json())
app.use(cors())
app.use(routes)

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})