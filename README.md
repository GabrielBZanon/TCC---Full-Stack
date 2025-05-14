# TCC---Full-Stack
Trabalho Final
# 📦 Smart Supply

**Smart Supply** é um sistema web para controle e gerenciamento de estoque, movimentações de entrada e saída de produtos, fornecedores e usuários. Desenvolvido com Node.js, JavaScript e Prisma ORM.

## 🚀 Funcionalidades

- CRUD de **Produtos**
- CRUD de **Fornecedores**
- CRUD de **Movimentações** (entrada e saída)
- Cadastro e autenticação de **Usuários**
- Cálculo automático da **data de movimentação**
- Relacionamentos entre produtos, fornecedores e movimentações

## 🛠 Tecnologias Utilizadas

- **Node.js** – ambiente de execução
- **JavaScript** – linguagem principal
- **Prisma ORM** – para manipulação do banco de dados
- **MySQL** – sistema gerenciador do banco de dados
- **Insomnia** – ferramenta para testes de rotas

## 🗃 Estrutura do Banco de Dados

### Tabelas

- `usuarios`: nome, email, senha, cargo, criadoEm
- `fornecedores`: nome, CNPJ, contato, email, criadoEm
- `produtos`: nome, descrição, código de barras, quantidade, localEstoque, fornecedorId, criadoEm, atualizadoEm
- `movimentacoes`: tipo (entrada/saída), quantidade, data, produtoId

### Relacionamentos

- Um **produto** pertence a **um fornecedor**
- Uma **movimentação** pertence a **um produto**

## 📌 Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/smart-supply.git
   cd smart-supply
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados no arquivo `prisma/schema.prisma`.

4. Rode as migrações:
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor:
   ```bash
   node index.js
   ```

## 📋 Requisitos

### Requisitos Funcionais

- [RF001] CRUD de produtos
- [RF002] CRUD de fornecedores
- [RF003] CRUD de movimentações
- [RF004] Cadastro e login de usuários

### Requisitos Não Funcionais

- [RN001] JavaScript
- [RN002] Node.js
- [RN003] Prisma ORM
- [RN004] VSCode
- [RN005] Insomnia

## Desenvolvedores

- Gabriel B. Zanon
- Kauê H. C. Fidelis
- Lucas G. Giachetto
- Marcos V. Oliveira
