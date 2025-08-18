
# **Smart Supply – Sistema de Almoxarifado & SCM**

Smart Supply é um sistema **full-stack** concebido para otimizar o controle de almoxarifado, fornecedores, usuários e movimentações de estoque em ambientes industriais.  
O projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) e demonstra boas práticas de arquitetura, código limpo e UX simples, porém profissional.

---

## ✨ Principais Funcionalidades

| Módulo | Descrição |
| ------ | --------- |
| **Produtos** | Cadastro / edição de itens, definição de setor & prioridade, estoque atualizado em tempo real. |
| **Fornecedores** | Registro de parceiros, CNPJ, contatos; vinculado aos produtos. |
| **Usuários** | Controle de acesso interno (nome, e-mail). |
| **Movimentações** | Entradas / saídas vinculadas a produto, usuário e fornecedor, com histórico completo. |
| **Dashboard** | Visão geral: totais de produtos, fornecedores, usuários e última movimentação. |

---

## 🏗️ Stack & Arquitetura

| Camada | Tecnologias |
| ------ | ----------- |
| **Back-end** | Node.js · Express · Prisma ORM · MySQL  |
| **Front-end** | HTML5 · CSS3 · JavaScript (ES6) – 100 % Vanilla |
| **Persistência local** | `localStorage` (front-end offline-first) |
| **Ferramentas** | Nodemon · VS Code · Insomnia/Postman |

> **Obs.:** O front-end consome a API REST do back-end; mas, em modo demo, pode operar apenas com `localStorage` para facilitar testes rápidos.

---

## ⚙️ Como Executar

### 1. Clonar o repositório
```bash
git clone https://github.com/<seu-usuario>/smart-supply.git
cd smart-supply
```

### 2. Back-end
```bash
cd api
npm install
npx prisma migrate dev          # gera o schema no MySQL
npm run dev                     # inicia em http://localhost:3000
```

### 3. Front-end
Abra `web/pages/index.html` no navegador  
*(ou sirva a pasta `web/` com uma extensão Live Server do VS Code).*

---

## 🗂️ Estrutura de Pastas (resumida)

```
api/                 # Node + Express + Prisma
web/
├── pages/           # HTML (Dashboard, Produtos, etc.)
├── css/             # style.css (único, responsivo)
└── js/              # api.js (persistência) · main.js (UI lógica)
```

---

## 👥 Autores

| Nome | Função |
| ---- | ------ |
| **Gabriel B. Zanon** | Desenvolvedor Full-Stack |
| **Lucas G. Giachetto** | Desenvolvedor Front-End|
| **Lucas M. Colombo** | Desenvolvedor Back-End |
| **Marcos V. Oliveira** | Engenheiro de Qualidade |
| **Kauê H. C. Fidellis** | Product Owner / Scrum Master |

---

## 📄 Licença
Projeto acadêmico – uso livre para fins de estudo. Credite os autores ao reutilizar.

---

<div align="center">

**Smart Supply** © 2025 &nbsp;·&nbsp; Todos os direitos reservados

</div>
